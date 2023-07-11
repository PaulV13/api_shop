import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RolEntity } from '../roles/entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RolEntity])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
