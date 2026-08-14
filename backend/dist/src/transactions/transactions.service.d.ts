import { PrismaService } from '../prisma/prisma.service';
export declare class TransactionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTransaction(userId: string, data: any): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: string;
        accountId: string;
        categoryId: string;
        merchantId: string | null;
        recurringId: string | null;
        transferLinkedId: string | null;
        idempotencyKey: string;
        amount: bigint;
        description: string | null;
        notes: string | null;
        tags: string[];
        transactionDate: Date;
        source: string;
        receiptUrl: string | null;
        syncStatus: string;
        clientCreatedAt: Date | null;
        version: number;
        isDeleted: boolean;
    }>;
    createTransfer(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        amount: bigint;
        description: string | null;
        transferDate: Date;
        sourceAccountId: string;
        destAccountId: string;
        debitTxnId: string;
        creditTxnId: string;
    }>;
}
