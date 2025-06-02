import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { Cookies } from './decorators/cookies.decorator';

@Controller('auth')
export class AuthController {
  EXPIRE_DAY_REFRESH_TOKEN = 30;
  REFRESH_TOKEN = 'refresh_token';

  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.login(loginDto);

    await this.setRefreshTokenCookie(data.tokens.refresh_token, response);

    return data;
  }

  @Post('sign-up')
  async signUp(
    @Body() signUpDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.register(signUpDto);

    await this.setRefreshTokenCookie(data.tokens.refresh_token, response);

    return data;
  }

  @Get('refresh')
  async refresh(
    @Cookies('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refresh_token, access_token } =
      await this.authService.refresh(refreshToken);

    await this.setRefreshTokenCookie(refresh_token, response);

    return { access_token, refresh_token };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: any,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.REFRESH_TOKEN);
    return 'Successfully logged out.';
  }

  private async setRefreshTokenCookie(
    refreshToken: string,
    response: Response,
  ) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    response.cookie(this.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      domain: 'localhost', // env
      expires: expiresIn,
      secure: true, // Set secure only in production
      sameSite: 'none', // lax in production
    });
  }
}
