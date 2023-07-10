import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { UpdateProductDTO } from '../dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(product: CreateProductDTO): Promise<ProductEntity> {
    const category = await this.categoryRepository.findOneBy({
      id: product.category_id,
    });

    if (!category) throw new BadRequestException('Category is not exist');

    const newProduct = this.productRepository.create(product);
    newProduct.category = category;

    return await this.productRepository.save(newProduct);
  }

  async getProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      relations: {
        category: true,
      },
    });
  }

  async getProduct(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      relations: { category: true },
      where: { id: id },
    });
    if (!product) throw new BadRequestException('Product is not exist');

    return product;
  }

  async updateProduct(
    id: string,
    updatedProduct: UpdateProductDTO,
  ): Promise<UpdateResult> {
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product) throw new BadRequestException('Product is not exist');

    return await this.productRepository.update(id, updatedProduct);
  }

  async deleteProduct(id: string): Promise<DeleteResult> {
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product) throw new BadRequestException('Product is not exist');

    return await this.productRepository.delete(id);
  }
}
