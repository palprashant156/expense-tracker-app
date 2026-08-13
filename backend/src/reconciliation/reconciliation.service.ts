import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReconciliationService {
  private readonly logger = new Logger(ReconciliationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async reconcileBalances() {
    this.logger.log('Starting balance reconciliation job...');

    const mismatches = await this.prisma.$queryRaw`
      WITH calculated AS (
        SELECT account_id,
          SUM(CASE WHEN type IN ('income', 'transfer_credit') THEN amount ELSE 0 END) -
          SUM(CASE WHEN type IN ('expense', 'transfer_debit') THEN amount ELSE 0 END) AS expected_balance
        FROM transactions
        WHERE is_deleted = FALSE
        GROUP BY account_id
      )
      SELECT a.id, a.balance AS cached,
            COALESCE(c.expected_balance, 0) AS calculated,
            a.user_id
      FROM accounts a
      LEFT JOIN calculated c ON c.account_id = a.id
      WHERE a.balance != COALESCE(c.expected_balance, 0);
    `;

    const typedMismatches = mismatches as any[];

    if (typedMismatches.length === 0) {
      this.logger.log('No balance mismatches found.');
      return { status: 'success', mismatchesFound: 0 };
    }

    this.logger.warn(\`Found \${typedMismatches.length} mismatches. Correcting...\`);

    for (const row of typedMismatches) {
      const { id: accountId, cached, calculated, user_id: userId } = row;

      await this.prisma.$transaction(async (tx) => {
        // Correct the balance
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: calculated,
            lastReconciledAt: new Date(),
          },
        });

        // Log the correction in audit_logs
        await tx.auditLog.create({
          data: {
            userId,
            action: 'balance.reconciliation_mismatch',
            entityType: 'account',
            entityId: accountId,
            oldValue: { balance: Number(cached) },
            newValue: { balance: Number(calculated) },
          },
        });
      });

      this.logger.log(\`Corrected account \${accountId}: \${cached} -> \${calculated}\`);
    }

    return { status: 'success', mismatchesFound: typedMismatches.length };
  }
}
