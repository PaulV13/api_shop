import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRolDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
