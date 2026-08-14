import { PrismaService } from '../prisma/prisma.service';
export declare class AiService {
    private readonly prisma;
    private readonly logger;
    private genAI;
    constructor(prisma: PrismaService);
    processChat(userId: string, message: string): Promise<{
        role: string;
        content: string;
    }>;
    private runValidationGate;
}
