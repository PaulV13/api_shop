import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateRolDTO } from '../dtos/create-rol.dto';
import { RolesService } from '../services/roles.service';
import { updateRolDTO } from '../dtos/update-rol.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRol(@Body() rol: CreateRolDTO) {
    return await this.rolesService.create(rol);
  }

  @Get()
  async getRoles() {
    return await this.rolesService.getRoles();
  }

  @Get(':id')
  async getRol(@Param('id') id: string) {
    return await this.rolesService.getRol(id);
  }

  @Put(':id')
  async updateRol(@Param('id') id: string, @Body() updateData: updateRolDTO) {
    return await this.rolesService.updateRol(id, updateData);
  }

  @Delete(':id')
  async deleteRol(@Param('id') id: string) {
    return await this.rolesService.deleteRol(id);
  }
}
