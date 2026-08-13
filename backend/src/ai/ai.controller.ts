import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
// In a real app we would use a JwtAuthGuard
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('chat')
  async chat(@Body() body: { message: string }, @Req() req: any) {
    // Mock user ID for now since we don't have AuthGuard wired up fully
    const userId = req.user?.userId || 'mock-user-id';
    return this.aiService.processChat(userId, body.message);
  }
}
