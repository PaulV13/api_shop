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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { ProductsService } from '../services/products.service';
import { UpdateProductDTO } from '../dtos/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadConfig } from 'src/config/image-upload-config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import { join } from 'path';
import { RoleGuard } from 'src/roles/guards/roles.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('image', ImageUploadConfig))
  async createProduct(
    @Body() product: CreateProductDTO,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await cloudinary.uploader.upload(file.path);
    await fs.promises.unlink(
      join(__dirname, '../../../', `public/uploads/${file.filename}`),
    );
    return await this.productsService.createProduct(product, result.secure_url);
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

  @Get('title')
  async filterProductsByTitle(@Query('title') title: string) {
    return await this.productsService.getProductsByTitle(title);
  }

  @Get(':id')
  async getProduct(@Param('id', ParseUUIDPipe) id: string) {
    console.log('id: ', id);
    return await this.productsService.getProduct(id);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Patch(':id')
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedProduct: UpdateProductDTO,
  ) {
    return await this.productsService.updateProduct(id, updatedProduct);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Delete(':id')
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.deleteProduct(id);
  }
}
