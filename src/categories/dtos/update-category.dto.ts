import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  name: string;
}
