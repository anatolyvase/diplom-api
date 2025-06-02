import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id };

    return { user, tokens: this.signTokens(payload) };
  }

  async refresh(refresh_token: string) {
    try {
      const { id } = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_SECRET,
      });

      return this.signTokens({ id });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findOne(userId);

    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    if (changePasswordDto.newPassword === changePasswordDto.oldPassword) {
      throw new BadRequestException(
        'New password must be different from old password',
      );
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    return this.usersService.update(userId, {
      password: hashedPassword,
    });
  }

  protected signTokens(payload: { id: string; }) {
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '30d',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '30d',
      }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return { user, tokens: this.signTokens({ id: user.id }) };
  }
}
