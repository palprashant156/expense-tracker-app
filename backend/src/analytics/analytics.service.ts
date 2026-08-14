import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Financial Health Score Algorithm
   * Scale 0 - 100
   * 
   * Factors:
   * 1. Savings Rate (Income vs Expense) - 40 points
   * 2. Emergency Fund (Cash Balance vs Monthly Expense) - 40 points
   * 3. Discretionary Spending (Percentage of income spent on wants) - 20 points
   */
  async getHealthScore(userId: string) {
    // Note: Since DB is mock-level for now, we will compute a basic score
    const accounts = await this.prisma.account.findMany({ where: { userId } });
    const currentMonth = new Date();
    currentMonth.setDate(1);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: { gte: currentMonth },
      },
      include: { category: true }
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let totalBalance = 0;

    accounts.forEach(acc => totalBalance += Number(acc.balance));
    
    transactions.forEach(tx => {
      if (tx.type === 'income') totalIncome += Number(tx.amount);
      if (tx.type === 'expense') totalExpense += Number(tx.amount);
    });

    let score = 50; // Base score

    // 1. Savings Rate Metric
    if (totalIncome > 0) {
      const savingsRate = (totalIncome - totalExpense) / totalIncome;
      if (savingsRate > 0.2) score += 25;
      else if (savingsRate > 0.1) score += 15;
      else if (savingsRate > 0) score += 5;
      else score -= 20; // Negative savings
    }

    // 2. Emergency Fund Metric
    if (totalExpense > 0) {
      const monthsOfReserve = totalBalance / totalExpense;
      if (monthsOfReserve > 6) score += 25;
      else if (monthsOfReserve > 3) score += 15;
      else if (monthsOfReserve > 1) score += 5;
      else score -= 10;
    }

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, Math.round(score)));

    return {
      score,
      metrics: {
        totalIncome,
        totalExpense,
        totalBalance,
      }
    };
  }
}
