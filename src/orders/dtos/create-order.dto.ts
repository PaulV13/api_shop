import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { OrderItemDTO } from 'src/orders/dtos/order-item.dto';

export class CreateOrderDTO {
  @IsNotEmpty()
  @ApiProperty({ type: [OrderItemDTO] })
  ordersItem: OrderItemDTO[];
}
