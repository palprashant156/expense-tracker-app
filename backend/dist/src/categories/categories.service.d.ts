import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCategories(userId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        userId: string | null;
        type: string;
        icon: string;
        color: string;
        isSystem: boolean;
    }[]>;
    createCategory(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        userId: string | null;
        type: string;
        icon: string;
        color: string;
        isSystem: boolean;
    }>;
}
