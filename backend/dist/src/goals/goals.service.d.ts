import { PrismaService } from '../prisma/prisma.service';
export declare class GoalsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createBudget(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        period: string;
        startDate: Date;
        endDate: Date;
        totalAmount: bigint;
        totalSpent: bigint;
    }>;
    createGoal(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        status: string;
        targetAmount: bigint;
        currentAmount: bigint;
        deadline: Date | null;
    }>;
    getGoals(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        status: string;
        targetAmount: bigint;
        currentAmount: bigint;
        deadline: Date | null;
    }[]>;
}
