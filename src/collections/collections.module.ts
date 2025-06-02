import { Module } from '@nestjs/common';
import { DatabaseModule } from "../database/database.module";
import { ProductsModule } from "../products/products.module";
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
