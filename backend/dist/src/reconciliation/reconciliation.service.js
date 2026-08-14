"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReconciliationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReconciliationService = ReconciliationService_1 = class ReconciliationService {
    prisma;
    logger = new common_1.Logger(ReconciliationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async reconcileBalances() {
        this.logger.log('Starting balance reconciliation job...');
        const mismatches = await this.prisma.$queryRaw `
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
        const typedMismatches = mismatches;
        if (typedMismatches.length === 0) {
            this.logger.log('No balance mismatches found.');
            return { status: 'success', mismatchesFound: 0 };
        }
        this.logger.warn(`Found ${typedMismatches.length} mismatches. Correcting...`);
        for (const row of typedMismatches) {
            const { id: accountId, cached, calculated, user_id: userId } = row;
            await this.prisma.$transaction(async (tx) => {
                await tx.account.update({
                    where: { id: accountId },
                    data: {
                        balance: calculated,
                        lastReconciledAt: new Date(),
                    },
                });
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
            this.logger.log(`Corrected account ${accountId}: ${cached} -> ${calculated}`);
        }
        return { status: 'success', mismatchesFound: typedMismatches.length };
    }
};
exports.ReconciliationService = ReconciliationService;
exports.ReconciliationService = ReconciliationService = ReconciliationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReconciliationService);
//# sourceMappingURL=reconciliation.service.js.map