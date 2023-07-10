import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
