import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: any): Promise<{
        accessToken: string;
        refreshToken: string;
        refreshTokenId: string;
    }>;
    login(data: any): Promise<{
        accessToken: string;
        refreshToken: string;
        refreshTokenId: string;
    }>;
    refresh(refreshToken: string, deviceId?: string, userAgent?: string, ipAddress?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
    private hashToken;
}
