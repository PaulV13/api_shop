import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { OrderItemDTO } from 'src/orders/dtos/order-item.dto';

export class CreateOrderDTO {
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  total_price: number;

  @IsNotEmpty()
  @ApiProperty()
  user_id: string;

  @IsNotEmpty()
  @ApiProperty({ type: [OrderItemDTO] })
  ordersItem: OrderItemDTO[];
}
