import { PrismaService } from '../prisma/prisma.service';
export declare class AccountsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createAccount(userId: string, data: any): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: string;
        balance: bigint;
        isArchived: boolean;
        lastReconciledAt: Date | null;
    }>;
    getAccounts(userId: string): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: string;
        balance: bigint;
        isArchived: boolean;
        lastReconciledAt: Date | null;
    }[]>;
    updateAccount(userId: string, id: string, data: any): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: string;
        balance: bigint;
        isArchived: boolean;
        lastReconciledAt: Date | null;
    }>;
}
