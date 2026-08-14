import { Controller, Get, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtService } from '@nestjs/jwt';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  private getUserId(req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      return decoded.sub;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get()
  async getAccounts(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.accountsService.getAccounts(userId);
  }

  @Post()
  async createAccount(@Req() req: any, @Body() body: any) {
    const userId = this.getUserId(req);
    return this.accountsService.createAccount(userId, body);
  }
}
