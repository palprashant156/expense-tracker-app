import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(userId: string, data: any) {
    // Check for idempotency
    if (data.idempotencyKey) {
      const existing = await this.prisma.transaction.findFirst({
        where: { idempotencyKey: data.idempotencyKey, userId },
      });
      if (existing) return existing;
    }

    return this.prisma.$transaction(async (tx) => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          userId,
          accountId: data.accountId,
          categoryId: data.categoryId,
          amount: data.amount,
          type: data.type,
          description: data.description,
          idempotencyKey: data.idempotencyKey,
        },
      });

      // Atomic balance update
      let balanceChange = 0;
      if (data.type === 'income') balanceChange = data.amount;
      if (data.type === 'expense') balanceChange = -data.amount;

      if (balanceChange !== 0) {
        await tx.account.update({
          where: { id: data.accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }

      return transaction;
    });
  }

  async createTransfer(userId: string, data: any) {
    if (data.idempotencyKey) {
      const existing = await this.prisma.transfer.findFirst({
        where: { idempotencyKey: data.idempotencyKey, userId },
      });
      if (existing) return existing;
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create the transfer record
      const transfer = await tx.transfer.create({
        data: {
          userId,
          sourceAccountId: data.sourceAccountId,
          destAccountId: data.destAccountId,
          amount: data.amount,
          description: data.description,
          idempotencyKey: data.idempotencyKey,
        },
      });

      // 2. Create debit transaction (deduct from source)
      const debitTx = await tx.transaction.create({
        data: {
          userId,
          accountId: data.sourceAccountId,
          amount: data.amount,
          type: 'transfer_debit',
          transferLinkedId: transfer.id,
          description: data.description || 'Transfer out',
        },
      });

      // 3. Create credit transaction (add to dest)
      const creditTx = await tx.transaction.create({
        data: {
          userId,
          accountId: data.destAccountId,
          amount: data.amount,
          type: 'transfer_credit',
          transferLinkedId: transfer.id,
          description: data.description || 'Transfer in',
        },
      });

      // 4. Atomic balance updates
      await tx.account.update({
        where: { id: data.sourceAccountId },
        data: { balance: { decrement: data.amount } },
      });

      await tx.account.update({
        where: { id: data.destAccountId },
        data: { balance: { increment: data.amount } },
      });

      return transfer;
    });
  }
}
