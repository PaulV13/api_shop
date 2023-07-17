import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginResponse } from '../interfaces/auth-interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, pass: string): Promise<AuthLoginResponse> {
    const user = await this.userService.getUserByUsername(username);

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new BadRequestException('Credential invalid');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      }),
    };
  }

  async refreshToken(userId: string): Promise<any> {
    const user = await this.userService.getUser(userId);

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      }),
    };
  }
}
