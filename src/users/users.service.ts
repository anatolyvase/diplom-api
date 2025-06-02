import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from "../database/database.service";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailExists = await this.findByEmail(createUserDto.email);

    if (isEmailExists) {
      throw new BadRequestException('Email already exists');
    }

    return this.db.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.db.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.db.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.db.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
