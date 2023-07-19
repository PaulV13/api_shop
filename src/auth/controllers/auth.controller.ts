import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Render,
  Res,
  Param,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../dtos/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefresTokenGuard } from '../guards/auth.refresh_token.guard';
import { ResetPasswordDTO } from '../dtos/reset-password.dto';
import { ForgotPasswordDTO } from '../dtos/forgot-password.dto';
import { Response } from 'express';
@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    return await this.authService.login(loginDto.username, loginDto.password);
  }

  @UseGuards(RefresTokenGuard)
  @Get('refresh_token')
  async getRefreshToken(@Request() req: Request) {
    return await this.authService.refreshToken(req['user'].sub);
  }

  @Get('forgot-password')
  @Render('email-confirmation')
  async forgotPasswordTemplate() {
    return { title: 'Forgot Password' };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPassword: ForgotPasswordDTO,
    @Res() res: Response,
  ) {
    const message = await this.authService.forgotPassword(forgotPassword.email);
    return res.render('message-confirmation', { message: message });
  }

  @Get('reset-password/:userId/:token')
  @Render('password-confirmation')
  async resetPasswordTemplate(
    @Param('userId') userId: string,
    @Param('token') token: string,
  ) {
    await this.authService.resetPasswordTemplate(token, userId);
    return { title: 'Reset Password', token: token, userId: userId };
  }

  @Post('reset-password/:userId/:token')
  async resetPassword(
    @Param('userId') userId: string,
    @Param('token') token: string,
    @Body() resetPassword: ResetPasswordDTO,
    @Res() res: Response,
  ) {
    const message = await this.authService.resetPassword(
      resetPassword.password,
      resetPassword.passwordConfirm,
      token,
      userId,
    );

    return res.render('message-password-confirmation', { message: message });
  }
}
