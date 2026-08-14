import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(userId: string, data: any) {
    return this.prisma.account.create({
      data: {
        userId,
        name: data.name,
        type: data.type, // checking, savings, credit, cash
        balance: data.initialBalance || 0,
        currency: data.currency || 'INR',
      },
    });
  }

  async getAccounts(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAccount(userId: string, id: string, data: any) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });
    if (!account) throw new NotFoundException('Account not found');

    return this.prisma.account.update({
      where: { id },
      data,
    });
  }
}
