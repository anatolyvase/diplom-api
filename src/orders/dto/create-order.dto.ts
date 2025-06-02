import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
	@IsArray()
	@IsNotEmpty()
	@IsString({ each: true })
	products: string[]
}
