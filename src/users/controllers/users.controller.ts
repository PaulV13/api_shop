import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRoleUserDTO } from '../dtos/role-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: CreateUserDTO) {
    return await this.usersService.createUser(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Get('username')
  async getUserByUsername(@Query('username') username: string) {
    return await this.usersService.getUserByUsername(username);
  }

  @Get('role')
  async getUsersByRole(@Query('roleName') roleName: string) {
    return await this.usersService.getUsersByRole(roleName);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.getUser(id);
  }

  @Patch(':id/change-role')
  async changeUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() roleUpdated: UpdateRoleUserDTO,
  ) {
    return await this.usersService.changeUserRole(id, roleUpdated);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userUpdate: UpdateUserDTO,
  ) {
    return await this.usersService.updateUser(id, userUpdate);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUser(id);
  }
}
