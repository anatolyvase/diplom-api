import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from "../database/database.service";
import { ProductsService } from "../products/products.service";
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
	constructor(private readonly db: DatabaseService, private readonly productsService: ProductsService) {
	}

	async create(createOrderDto: CreateOrderDto, userId: string) {
		const products = await this.productsService.findManyByIds(createOrderDto.products.map(item => item.id));
		if (products.length !== createOrderDto.products.length || products.length === 0) {
			throw new NotFoundException(`Products not found!`);
		}

		try {
			return this.db.order.create({
				data: {
					status: "Принят",
					userId: userId,
					totalPrice: products.reduce((acc, cur) => acc + cur.price, 0),
					products: {
						createMany: {
							data: createOrderDto.products.map(({ id, quantity }) => ({
								productId: id,
								quantity
							}))
						}
					}
				},
			})
		} catch (error) {
			throw new InternalServerErrorException('Unable to create order')
		}
	}

	async findAll(userId: string) {
		const orders = await this.db.order.findMany({
			where: {
				userId,
			},
			include: {
				products: {
					include: {
						product: true
					}
				}
			}
		});

		return orders.map(order => {
			const products = order.products.map(({ product, quantity }) => ({ ...product, quantity }));

			return { ...order, products };
		})
	}
}
