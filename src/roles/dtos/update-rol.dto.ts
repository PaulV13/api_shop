import { IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../interfaces/user-rol.interface';

export class UpdateRolDTO {
  @IsNotEmpty()
  @IsString()
  name: UserRole;
}
