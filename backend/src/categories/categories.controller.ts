import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtService } from '@nestjs/jwt';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
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
  async getCategories(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.categoriesService.getCategories(userId);
  }
}
