import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, UseGuards, } from '@nestjs/common';
import { CurrentUser } from "../auth/decorators";
import { JwtAuthGuard } from "../auth/guards";
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getMe(@CurrentUser() user: any) {
		return user;
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.usersService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.usersService.remove(id);
	}
}
