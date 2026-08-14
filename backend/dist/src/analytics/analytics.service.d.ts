import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHealthScore(userId: string): Promise<{
        score: number;
        metrics: {
            totalIncome: number;
            totalExpense: number;
            totalBalance: number;
        };
    }>;
}
