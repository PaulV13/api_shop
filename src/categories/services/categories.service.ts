import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDTO } from '../dtos/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { UpdateCategoryDTO } from '../dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(category: CreateCategoryDTO): Promise<CategoryEntity> {
    const categoryExists = await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name = :name', { name: category.name })
      .getOne();

    if (categoryExists)
      throw new BadRequestException('Category already exists');

    const newCategory = this.categoryRepository.create(category);
    return await this.categoryRepository.save(newCategory);
  }

  async getCategories(): Promise<CategoryEntity[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .getMany();
  }

  async getCategory(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .getOne();

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async getCategoryByName(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = :name', { name: name.toLowerCase() })
      .getOne();

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(
    id: string,
    updatedCategory: UpdateCategoryDTO,
  ): Promise<CategoryEntity> {
    const category = await this.getCategory(id);
    if (!category) throw new NotFoundException('Category not found');

    return await this.categoryRepository.save({
      ...category,
      ...updatedCategory,
    });
  }

  async deleteCategory(id: string): Promise<CategoryEntity> {
    const category = await this.getCategory(id);
    if (!category) throw new NotFoundException('Category not found');

    return await this.categoryRepository.remove(category);
  }
}
