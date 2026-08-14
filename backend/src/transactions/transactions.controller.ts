import { Controller, Get, Post, Delete, Param, Body, Req, UnauthorizedException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
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
  async getTransactions(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { transactionDate: 'desc' },
      include: { category: true },
      take: 20
    });
  }

  @Post()
  async createTransaction(@Req() req: any, @Body() body: any) {
    const userId = this.getUserId(req);
    return this.transactionsService.createTransaction(userId, body);
  }

  @Post('transfer')
  async createTransfer(@Req() req: any, @Body() body: any) {
    const userId = this.getUserId(req);
    return this.transactionsService.createTransfer(userId, body);
  }

  @Get(':id')
  async getTransaction(@Req() req: any, @Param('id') id: string) {
    const userId = this.getUserId(req);
    return this.transactionsService.getTransaction(userId, id);
  }

  @Post(':id') // Alternatively PUT/PATCH
  async updateTransaction(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const userId = this.getUserId(req);
    return this.transactionsService.updateTransaction(userId, id, body);
  }

  @Delete(':id')
  async deleteTransaction(@Req() req: any, @Param('id') id: string) {
    const userId = this.getUserId(req);
    return this.transactionsService.deleteTransaction(userId, id);
  }
}
