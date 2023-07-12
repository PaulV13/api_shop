import { ProductEntity } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity()
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity, (product) => product.ordersItem)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => OrderEntity, (order) => order.ordersItem)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
