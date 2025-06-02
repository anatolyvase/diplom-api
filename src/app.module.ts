import { Module } from '@nestjs/common';
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { ProductsModule } from './products/products.module';
import { CollectionsModule } from './collections/collections.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [DatabaseModule, ProductsModule, CollectionsModule, UsersModule, AuthModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
