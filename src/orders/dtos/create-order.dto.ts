import { IsNotEmpty } from 'class-validator';
import { OrderItemDTO } from 'src/orders/dtos/order-item.dto';

export class CreateOrderDTO {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  total_price: number;

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  ordersItem: OrderItemDTO[];
}
