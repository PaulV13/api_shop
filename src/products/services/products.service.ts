import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { UpdateProductDTO } from '../dtos/update-product.dto';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createProduct(
    product: CreateProductDTO,
    file: string,
  ): Promise<ProductEntity> {
    if (!isValidUUID(product.category_id))
      throw new BadRequestException('Category id is not valid');

    const category = await this.categoryRepository.findOneBy({
      id: product.category_id,
    });
    if (!category) throw new NotFoundException('Category not found');

    const newProduct = this.productRepository.create(product);
    newProduct.category = category;
    newProduct.image = file ? file : '';

    return await this.productRepository.save(newProduct);
  }

  async getProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      select: {
        category: {
          name: true,
        },
      },
      relations: {
        category: true,
      },
    });
  }

  async getProduct(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      select: {
        category: {
          name: true,
        },
      },
      relations: { category: true },
      where: { id: id },
    });
    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async updateProduct(
    id: string,
    updatedProduct: UpdateProductDTO,
  ): Promise<UpdateResult> {
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product) throw new NotFoundException('Product not found');

    return await this.productRepository.update(id, updatedProduct);
  }

  async deleteProduct(id: string): Promise<DeleteResult> {
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product) throw new NotFoundException('Product not found');

    return await this.productRepository.delete(id);
  }

  async getProductsByCategory(categoryName: string): Promise<ProductEntity[]> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = :name', {
        name: categoryName.toLowerCase(),
      })
      .getOne();

    if (!category) throw new NotFoundException('Category not found');

    const products = await this.productRepository.find({
      where: {
        category: category,
      },
    });

    return products;
  }

  async getProductsByPriceRange(
    min: string,
    max: string,
  ): Promise<ProductEntity[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.price >= :min', { min })
      .andWhere('product.price <= :max', { max })
      .getMany();
  }

  async getProductsByTitle(title: string) {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('LOWER(product.title) like :title', {
        title: `%${title.toLocaleLowerCase()}%`,
      })
      .getMany();
  }
}
