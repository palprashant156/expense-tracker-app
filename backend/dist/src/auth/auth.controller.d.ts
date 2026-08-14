import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: any, req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        refreshTokenId: string;
    }>;
    login(body: any, req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        refreshTokenId: string;
    }>;
    refresh(body: {
        refreshToken: string;
        deviceId?: string;
    }, req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
