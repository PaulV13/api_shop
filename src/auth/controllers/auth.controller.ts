import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../dtos/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefresTokenGuard } from '../guards/auth.refresh_token.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @UseGuards(RefresTokenGuard)
  @Get('refresh_token')
  getRefreshToken(@Request() req: Request) {
    return this.authService.refreshToken(req['user'].sub);
  }
}
