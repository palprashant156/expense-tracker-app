import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any, @Req() req: any) {
    return this.authService.register({
      ...body,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
  }

  @Post('login')
  login(@Body() body: any, @Req() req: any) {
    return this.authService.login({
      ...body,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }, @Req() req: any) {
    return this.authService.refresh(
      body.refreshToken,
      body['deviceId'],
      req.headers['user-agent'],
      req.ip,
    );
  }
}
