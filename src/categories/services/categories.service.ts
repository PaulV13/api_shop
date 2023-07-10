import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDTO } from '../dtos/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { UpdateCategoryDTO } from '../dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repositoryCategory: Repository<CategoryEntity>,
  ) {}

  async create(category: CreateCategoryDTO): Promise<CategoryEntity> {
    const categoryExists = await this.repositoryCategory.findOneBy({
      name: category.name,
    });

    if (categoryExists)
      throw new BadRequestException('Category already exists');

    const newCategory = this.repositoryCategory.create(category);
    return await this.repositoryCategory.save(newCategory);
  }

  async getCategories(): Promise<CategoryEntity[]> {
    return await this.repositoryCategory.find();
  }

  async getCategory(id: string): Promise<CategoryEntity> {
    const category = await this.repositoryCategory.findOneBy({ id });
    if (!category) throw new BadRequestException('Category not found');

    return await this.repositoryCategory.findOneBy({ id });
  }

  async updateCategory(
    id: string,
    updatedCategory: UpdateCategoryDTO,
  ): Promise<UpdateResult> {
    const categoryExists = await this.repositoryCategory.findOneBy({
      name: updatedCategory.name,
    });

    if (categoryExists)
      throw new BadRequestException('Category already exists');

    const category = await this.repositoryCategory.findOneBy({ id });
    if (!category) throw new BadRequestException('Category not found');

    return await this.repositoryCategory.update(id, updatedCategory);
  }

  async deleteCategory(id: string): Promise<DeleteResult> {
    const category = await this.repositoryCategory.findOneBy({ id });
    if (!category) throw new BadRequestException('Category not found');

    return await this.repositoryCategory.delete(id);
  }
}
