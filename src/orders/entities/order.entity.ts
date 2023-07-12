import { OrderItemEntity } from './order-item.entity';
import { UserEntity } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @Column()
  total_price: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  ordersItem: OrderItemEntity[];
}
