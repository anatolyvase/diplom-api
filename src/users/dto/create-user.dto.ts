import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	password: string;

	@IsString()
	@MinLength(2)
	@MaxLength(50)
	firstName: string;

	@IsString()
	@MinLength(2)
	@MaxLength(50)
	lastName: string;
}
