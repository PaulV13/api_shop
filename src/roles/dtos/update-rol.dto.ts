import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRolDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
