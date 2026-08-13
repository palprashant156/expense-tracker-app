import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { crypto } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await argon2.hash(data.password, {
      memoryCost: 65536, // 64MB
      timeCost: 3,
    });

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
      },
    });

    return this.generateTokens(user.id, data.deviceId, data.userAgent, data.ipAddress);
  }

  async login(data: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await argon2.verify(user.passwordHash, data.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, data.deviceId, data.userAgent, data.ipAddress);
  }

  async refresh(refreshToken: string, deviceId?: string, userAgent?: string, ipAddress?: string) {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Token is structurally valid, check DB
    const tokenHash = await this.hashToken(refreshToken);
    const dbToken = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (!dbToken) {
      throw new UnauthorizedException('Token not found');
    }

    if (dbToken.revokedAt) {
      // Reuse detected! Legitimate client already rotated this. Revoke ALL tokens for user.
      await this.prisma.refreshToken.updateMany({
        where: { userId: dbToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Token reuse detected. All sessions revoked.');
    }

    // Valid token. Revoke it and generate a new one.
    await this.prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateTokens(dbToken.userId, deviceId, userAgent, ipAddress);

    // Link the new token back to the old one in the rotation chain
    await this.prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { replacedById: tokens.refreshTokenId },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private async generateTokens(userId: string, deviceId?: string, userAgent?: string, ipAddress?: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '15m', secret: process.env.JWT_SECRET }
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET }
    );

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

  private async hashToken(token: string): Promise<string> {
    const { createHash } = await import('crypto');
    return createHash('sha256').update(token).digest('hex');
  }
}
