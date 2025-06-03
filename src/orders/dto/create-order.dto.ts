import { Type } from "class-transformer";
import {
	IsArray,
	ValidateNested,
	IsString,
	IsNotEmpty,
	IsNumber,
	Min,
} from "class-validator";

class ProductItem {
	@IsString()
	@IsNotEmpty()
	id: string;

	@IsNumber()
	@Min(1)
	quantity: number;
}

export class CreateOrderDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductItem)
	products: ProductItem[];
}