import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemDTO {
  @IsNotEmpty()
  @ApiProperty()
  product_id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  quantity: number;
}
