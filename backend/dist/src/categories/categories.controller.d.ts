import { CategoriesService } from './categories.service';
import { JwtService } from '@nestjs/jwt';
export declare class CategoriesController {
    private readonly categoriesService;
    private readonly jwtService;
    constructor(categoriesService: CategoriesService, jwtService: JwtService);
    private getUserId;
    getCategories(req: any): Promise<{
        id: string;
        userId: string | null;
        name: string;
        icon: string;
        color: string;
        type: string;
        isSystem: boolean;
        createdAt: Date;
    }[]>;
}
