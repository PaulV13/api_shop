import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDTO } from '../dtos/create-category.dto';
import { CategoriesService } from '../services/categories.service';
import { UpdateCategoryDTO } from '../dtos/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/roles/guards/roles.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  async createCategory(@Body() category: CreateCategoryDTO) {
    return await this.categoriesService.createCategory(category);
  }

  @Get()
  async getCategories() {
    return await this.categoriesService.getCategories();
  }

  @Get('name')
  async getCategoryByName(@Query('name') name: string) {
    return await this.categoriesService.getCategoryByName(name);
  }

  @Get(':id')
  async getCategory(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoriesService.getCategory(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedCategory: UpdateCategoryDTO,
  ) {
    return await this.categoriesService.updateCategory(id, updatedCategory);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoriesService.deleteCategory(id);
  }
}
