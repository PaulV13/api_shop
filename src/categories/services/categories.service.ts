import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDTO } from '../dtos/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { UpdateCategoryDTO } from '../dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(category: CreateCategoryDTO): Promise<CategoryEntity> {
    const categoryExists = await this.categoryRepository.findOneBy({
      name: category.name,
    });

    if (categoryExists)
      throw new BadRequestException('Category already exists');

    const newCategory = this.categoryRepository.create(category);
    return await this.categoryRepository.save(newCategory);
  }

  async getCategories(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  async getCategory(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOneBy({ id });
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

  async getCategoryByName(name: string): Promise<CategoryEntity> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = :name', { name: name.toLowerCase() })
      .getOne();
  }
}
