import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories(userId: string) {
    // Return system default categories and user-specific custom categories
    return this.prisma.category.findMany({
      where: {
        OR: [
          { userId: null }, // System defaults
          { userId },
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async createCategory(userId: string, data: any) {
    return this.prisma.category.create({
      data: {
        userId,
        name: data.name,
        type: data.type, // income or expense
        icon: data.icon,
        color: data.color,
      },
    });
  }
}
