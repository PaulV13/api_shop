import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
