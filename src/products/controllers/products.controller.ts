import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { ProductsService } from '../services/products.service';
import { UpdateProductDTO } from '../dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() product: CreateProductDTO) {
    return await this.productsService.create(product);
  }

  @Get()
  async getProducts() {
    return await this.productsService.getProducts();
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return await this.productsService.getProduct(id);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updatedProduct: UpdateProductDTO,
  ) {
    return await this.productsService.updateProduct(id, updatedProduct);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.deleteProduct(id);
  }
}
