import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from "../database/database.service";

@Injectable()
export class ProductsService {
  constructor(private readonly db: DatabaseService) {
  }
  async findAll() {
    return this.db.product.findMany()
  }

  async findOne(id: string) {
    const product = await this.db.product.findUnique({
      where: { id }
    })

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findManyByIds(ids: string[]) {
    return this.db.product.findMany({
      where: {
        id: {
          in: ids
        }
      }
    })
  }
}
