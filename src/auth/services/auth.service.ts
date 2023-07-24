import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginResponse } from '../interfaces/auth-interface';
import { transporter } from 'src/config/mailer-config';

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
      role: user.role.name,
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
      role: user.role.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      }),
    };
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.userService.getUserByEmail(email);

    const secret = process.env.ACCESS_TOKEN_SECRET + user.password;

    const payload = {
      sub: user.id,
      email: email,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: '1h',
    });

    const info = await transporter.sendMail({
      from: 'paulvidart@gmail.com',
      to: user.email,
      subject: 'Forgot password',
      html: `
        <div>
          <p>
            Hi ${user.name}
          </p>
        </div>
        <div>
          <p>
            We've recived a request to reset the password for ${user.email}.
            You can reset your password by clicking the link below:
          </p>
        </div>
        <div>
          <a href='http://localhost:3002/api/auth/reset-password/${user.id}/${token}'>http://localhost:3002/api/auth/reset-password/${user.id}/${token}</a>
        </div>
        <div>
          <p>
            If you don't initiate this request, please contact us immediately at shopsupport@gmail.com
          </p>
          <p>
            Thank you, ShopApi
          </p>
        </div>
        `,
    });

    if (info.accepted.length === 0)
      throw new BadRequestException('Error to send a email');

    return `Send email to ${user.email}`;
  }

  async resetPasswordTemplate(token: string, userId: string) {
    try {
      const user = await this.userService.getUser(userId);

      const secret = process.env.ACCESS_TOKEN_SECRET + user.password;

      await this.jwtService.verifyAsync(token, { secret });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resetPassword(
    pass: string,
    passConfirm: string,
    token: string,
    userId: string,
  ): Promise<string> {
    try {
      if (passConfirm !== pass)
        throw new BadRequestException('Passwords are not equal');

      const user = await this.userService.getUser(userId);

      const secret = process.env.ACCESS_TOKEN_SECRET + user.password;

      await this.jwtService.verifyAsync(token, { secret });

      const passwordHash = await bcrypt.hash(pass, 10);
      user.password = passwordHash;

      const userUpdated = await this.userService.updateUser(user.id, user);

      if (!userUpdated)
        throw new BadRequestException('User password not updated');

      return 'Password change succesfully';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
