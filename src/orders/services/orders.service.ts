import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderItemEntity } from '../../orders/entities/order-item.entity';
import { CreateOrderDTO } from '../dtos/create-order.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly ordersItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  async createOrder(
    order: CreateOrderDTO,
    userId: string,
  ): Promise<OrderEntity> {
    const newOrder = new OrderEntity();
    newOrder.date = new Date();
    newOrder.user = await this.userRepository.findOneBy({ id: userId });
    newOrder.total_price = 0;

    const items = await Promise.all(
      order.ordersItem.map(async (orderItem) => {
        const item = new OrderItemEntity();

        const product = await this.productsRepository.findOneBy({
          id: orderItem.product_id,
        });
        item.product = product;
        item.quantity = orderItem.quantity;
        item.price = product.price * item.quantity;

        newOrder.total_price += item.price;

        product.stock = product.stock - item.quantity;
        await this.productsRepository.save(product);

        await this.ordersItemRepository.save(item);

        return item;
      }),
    );

    newOrder.ordersItem = items;

    return await this.ordersRepository.save(newOrder);
  }

  async getOrders(userId: string): Promise<OrderEntity[]> {
    return await this.ordersRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        ordersItem: {
          price: true,
          quantity: true,
          product: {
            title: true,
            price: true,
            stock: true,
            category: {
              name: true,
            },
          },
        },
      },
      relations: {
        ordersItem: {
          product: {
            category: true,
          },
        },
      },
    });
  }
}
