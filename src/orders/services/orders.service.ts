import { BadRequestException, Injectable } from '@nestjs/common';
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

  async create(order: CreateOrderDTO): Promise<OrderEntity> {
    const user = await this.userRepository
      .createQueryBuilder()
      .where({ id: order.user_id })
      .getOne();
    if (!user) throw new BadRequestException('User not found');

    const newOrder = new OrderEntity();
    newOrder.date = order.date;
    newOrder.user = user;
    newOrder.total_price = 0;

    await this.ordersRepository.save(newOrder);

    order.ordersItem.map(async (orderItem) => {
      const product = await this.productsRepository
        .createQueryBuilder()
        .where({ id: orderItem.product_id })
        .getOne();

      const newOrderItem = new OrderItemEntity();
      newOrderItem.product = product;
      newOrderItem.quantity = orderItem.quantity;
      newOrderItem.price = newOrderItem.product.price * orderItem.quantity;
      newOrderItem.order = newOrder;

      newOrder.total_price += newOrderItem.price;
      await this.ordersItemRepository.save(newOrderItem);
    });

    return await this.ordersRepository.save(newOrder);
  }

  async getOrders(): Promise<OrderEntity[]> {
    return await this.ordersRepository.find({
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
