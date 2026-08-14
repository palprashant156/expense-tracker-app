"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        const existing = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('Email already in use');
        }
        const passwordHash = await argon2.hash(data.password, {
            memoryCost: 65536,
            timeCost: 3,
        });
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                fullName: data.fullName,
            },
        });
        await this.prisma.account.createMany({
            data: [
                { userId: user.id, name: 'Cash', type: 'cash', balance: 0, currency: 'INR' },
                { userId: user.id, name: 'Bank Account', type: 'checking', balance: 0, currency: 'INR' },
            ],
        });
        return this.generateTokens(user.id, data.deviceId, data.userAgent, data.ipAddress);
    }
    async login(data) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isValid = await argon2.verify(user.passwordHash, data.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateTokens(user.id, data.deviceId, data.userAgent, data.ipAddress);
    }
    async refresh(refreshToken, deviceId, userAgent, ipAddress) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokenHash = await this.hashToken(refreshToken);
        const dbToken = await this.prisma.refreshToken.findFirst({
            where: { tokenHash },
        });
        if (!dbToken) {
            throw new common_1.UnauthorizedException('Token not found');
        }
        if (dbToken.revokedAt) {
            await this.prisma.refreshToken.updateMany({
                where: { userId: dbToken.userId, revokedAt: null },
                data: { revokedAt: new Date() },
            });
            throw new common_1.UnauthorizedException('Token reuse detected. All sessions revoked.');
        }
        await this.prisma.refreshToken.update({
            where: { id: dbToken.id },
            data: { revokedAt: new Date() },
        });
        const tokens = await this.generateTokens(dbToken.userId, deviceId, userAgent, ipAddress);
        await this.prisma.refreshToken.update({
            where: { id: dbToken.id },
            data: { replacedById: tokens.refreshTokenId },
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
    async generateTokens(userId, deviceId, userAgent, ipAddress) {
        const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '15m', secret: process.env.JWT_SECRET });
        const refreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET });
        const tokenHash = await this.hashToken(refreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const savedToken = await this.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                deviceId,
                userAgent,
                ipAddress,
                expiresAt,
            },
        });
        return {
            accessToken,
            refreshToken,
            refreshTokenId: savedToken.id,
        };
    }
    async hashToken(token) {
        const { createHash } = await import('crypto');
        return createHash('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map