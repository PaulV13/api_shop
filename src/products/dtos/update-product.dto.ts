import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  title: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  stock: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  category_id: string;
}
