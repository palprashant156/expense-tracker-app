import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class UsersController {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    getMe(req: any): Promise<{
        id: string;
        email: string;
        fullName: string;
        currency: string;
    } | null>;
}
