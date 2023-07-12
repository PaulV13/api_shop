import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description: string;
}
