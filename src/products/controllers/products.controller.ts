import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { ProductsService } from '../services/products.service';
import { UpdateProductDTO } from '../dtos/update-product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
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

  @Get('category')
  async getProductsByCategory(@Query('category') category: string) {
    return await this.productsService.getProductsByCategory(category);
  }

  @Get('price')
  async getProductsByPriceRange(
    @Query('min') min: string,
    @Query('max') max: string,
  ) {
    return await this.productsService.getProductsByPriceRange(min, max);
  }

  @Get(':id')
  async getProduct(@Param('id', ParseUUIDPipe) id: string) {
    console.log('id: ', id);
    return await this.productsService.getProduct(id);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedProduct: UpdateProductDTO,
  ) {
    return await this.productsService.updateProduct(id, updatedProduct);
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.deleteProduct(id);
  }
}
