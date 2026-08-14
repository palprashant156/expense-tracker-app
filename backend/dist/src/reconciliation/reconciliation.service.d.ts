import { PrismaService } from '../prisma/prisma.service';
export declare class ReconciliationService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    reconcileBalances(): Promise<{
        status: string;
        mismatchesFound: number;
    }>;
}
