import { IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../interfaces/user-rol.interface';

export class CreateRolDTO {
  @IsNotEmpty()
  @IsString()
  name: UserRole;
}
