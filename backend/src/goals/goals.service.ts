import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBudget(userId: string, data: any) {
    return this.prisma.budget.create({
      data: {
        userId,
        categoryId: data.categoryId,
        amount: data.amount,
        period: data.period || 'monthly',
        startDate: data.startDate,
        endDate: data.endDate,
      }
    });
  }

  async createGoal(userId: string, data: any) {
    return this.prisma.goal.create({
      data: {
        userId,
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount || 0,
        targetDate: data.targetDate,
        color: data.color,
        icon: data.icon,
      }
    });
  }

  async getGoals(userId: string) {
    return this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
