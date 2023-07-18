import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
