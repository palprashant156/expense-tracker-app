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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTransaction(userId, data) {
        if (data.idempotencyKey) {
            const existing = await this.prisma.transaction.findFirst({
                where: { idempotencyKey: data.idempotencyKey, userId },
            });
            if (existing)
                return existing;
        }
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    accountId: data.accountId,
                    categoryId: data.categoryId || '00000000-0000-0000-0000-000000000000',
                    amount: data.amount,
                    type: data.type,
                    description: data.description || '',
                    idempotencyKey: data.idempotencyKey,
                    transactionDate: data.transactionDate || new Date(),
                },
            });
            let balanceChange = 0;
            if (data.type === 'income')
                balanceChange = data.amount;
            if (data.type === 'expense')
                balanceChange = -data.amount;
            if (balanceChange !== 0) {
                await tx.account.update({
                    where: { id: data.accountId },
                    data: { balance: { increment: balanceChange } },
                });
            }
            return transaction;
        });
    }
    async createTransfer(userId, data) {
        return this.prisma.$transaction(async (tx) => {
            const debitTx = await tx.transaction.create({
                data: {
                    userId,
                    accountId: data.sourceAccountId,
                    amount: data.amount,
                    type: 'transfer_debit',
                    description: data.description || 'Transfer out',
                    transactionDate: new Date(),
                    categoryId: '00000000-0000-0000-0000-000000000000',
                },
            });
            const creditTx = await tx.transaction.create({
                data: {
                    userId,
                    accountId: data.destAccountId,
                    amount: data.amount,
                    type: 'transfer_credit',
                    description: data.description || 'Transfer in',
                    transactionDate: new Date(),
                    categoryId: '00000000-0000-0000-0000-000000000000',
                },
            });
            const transfer = await tx.transfer.create({
                data: {
                    userId,
                    sourceAccountId: data.sourceAccountId,
                    destAccountId: data.destAccountId,
                    amount: data.amount,
                    description: data.description,
                    transferDate: new Date(),
                    debitTxnId: debitTx.id,
                    creditTxnId: creditTx.id,
                },
            });
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
    async getTransaction(userId, id) {
        const tx = await this.prisma.transaction.findFirst({
            where: { id, userId, isDeleted: false },
            include: { category: true, account: true },
        });
        if (!tx)
            throw new common_1.NotFoundException('Transaction not found');
        return tx;
    }
    async deleteTransaction(userId, id) {
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findFirst({
                where: { id, userId, isDeleted: false },
            });
            if (!transaction)
                throw new common_1.NotFoundException('Transaction not found');
            let balanceChange = 0n;
            if (transaction.type === 'income')
                balanceChange = -transaction.amount;
            if (transaction.type === 'expense')
                balanceChange = transaction.amount;
            if (balanceChange !== 0n) {
                await tx.account.update({
                    where: { id: transaction.accountId },
                    data: { balance: { increment: balanceChange } },
                });
            }
            await tx.transaction.update({
                where: { id },
                data: { isDeleted: true },
            });
            return { success: true };
        });
    }
    async updateTransaction(userId, id, data) {
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findFirst({
                where: { id, userId, isDeleted: false },
            });
            if (!transaction)
                throw new common_1.NotFoundException('Transaction not found');
            let oldBalanceChange = 0n;
            if (transaction.type === 'income')
                oldBalanceChange = -transaction.amount;
            if (transaction.type === 'expense')
                oldBalanceChange = transaction.amount;
            if (oldBalanceChange !== 0n) {
                await tx.account.update({
                    where: { id: transaction.accountId },
                    data: { balance: { increment: oldBalanceChange } },
                });
            }
            const updated = await tx.transaction.update({
                where: { id },
                data: {
                    amount: data.amount !== undefined ? data.amount : transaction.amount,
                    type: data.type !== undefined ? data.type : transaction.type,
                    description: data.description !== undefined ? data.description : transaction.description,
                    categoryId: data.categoryId !== undefined ? data.categoryId : transaction.categoryId,
                    accountId: data.accountId !== undefined ? data.accountId : transaction.accountId,
                },
            });
            let newBalanceChange = 0n;
            if (updated.type === 'income')
                newBalanceChange = updated.amount;
            if (updated.type === 'expense')
                newBalanceChange = -updated.amount;
            if (newBalanceChange !== 0n) {
                await tx.account.update({
                    where: { id: updated.accountId },
                    data: { balance: { increment: newBalanceChange } },
                });
            }
            return updated;
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map