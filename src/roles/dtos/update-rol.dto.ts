import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRolDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
