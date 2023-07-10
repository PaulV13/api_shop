import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { CreateCategoryDTO } from '../dtos/create-category.dto';
import { CategoriesService } from '../services/categories.service';
import { UpdateCategoryDTO } from '../dtos/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() category: CreateCategoryDTO) {
    return await this.categoriesService.create(category);
  }

  @Get()
  async getCategories() {
    return await this.categoriesService.getCategories();
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    return await this.categoriesService.getCategory(id);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updatedCategory: UpdateCategoryDTO,
  ) {
    return await this.categoriesService.updateCategory(id, updatedCategory);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoriesService.deleteCategory(id);
  }
}
