import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateRolDTO } from '../dtos/create-rol.dto';
import { RolesService } from '../services/roles.service';
import { UpdateRoleDTO } from '../dtos/update-rol.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../guards/roles.guard';

@ApiTags('roles')
@Controller('roles')
@ApiBearerAuth()
@UseGuards(RoleGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() rol: CreateRolDTO) {
    return await this.rolesService.createRole(rol);
  }

  @Get()
  async getRoles() {
    return await this.rolesService.getRoles();
  }

  @Get(':id')
  async getRole(@Param('id', ParseUUIDPipe) id: string) {
    return await this.rolesService.getRole(id);
  }

  @Put(':id')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedRole: UpdateRoleDTO,
  ) {
    return await this.rolesService.updateRole(id, updatedRole);
  }

  @Delete(':id')
  async deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return await this.rolesService.deleteRole(id);
  }
}
