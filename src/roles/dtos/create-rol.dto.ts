import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
