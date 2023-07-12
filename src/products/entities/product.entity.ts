import { CategoryEntity } from '../../categories/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItemEntity } from '../../orders/entities/order-item.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column()
  category_id: string;

  @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  ordersItem: OrderItemEntity[];
}
