import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderItemDTO {
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  order_id: string;
}
