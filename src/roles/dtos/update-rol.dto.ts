import { IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../interfaces/user-rol.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRolDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: UserRole })
  name: UserRole;
}
