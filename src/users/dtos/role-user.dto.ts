import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  roleName: string;
}
