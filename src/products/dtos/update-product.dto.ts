import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  stock: number;

  @IsString()
  @IsOptional()
  category_id: string;
}
