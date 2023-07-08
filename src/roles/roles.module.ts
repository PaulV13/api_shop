import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEntity } from './entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolEntity])],
  providers: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
