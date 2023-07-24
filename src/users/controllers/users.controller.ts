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
  UploadedFile,
  ParseFilePipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateRoleUserDTO } from '../dtos/role-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadConfig } from '../../config/image-upload-config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import { join } from 'path';
import { RoleGuard } from 'src/roles/guards/roles.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', ImageUploadConfig))
  async createUser(
    @Body() user: CreateUserDTO,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await cloudinary.uploader.upload(file.path);
    await fs.promises.unlink(
      join(__dirname, '../../../', `public/uploads/${file.filename}`),
    );
    return await this.usersService.createUser(user, result.secure_url);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Get('username')
  async getUserByUsername(@Query('username') username: string) {
    return await this.usersService.getUserByUsername(username);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Get('role')
  async getUsersByRole(@Query('roleName') roleName: string) {
    return await this.usersService.getUsersByRole(roleName);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.getUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
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
