import { IsNotEmpty, IsString } from 'class-validator';

export class updateRolDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
