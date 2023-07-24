import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/rol.entity';
import { Repository } from 'typeorm';
import { CreateRolDTO } from '../dtos/create-rol.dto';
import { UpdateRoleDTO } from '../dtos/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async createRole(roleCreated: CreateRolDTO): Promise<RoleEntity> {
    const roleExists = await this.roleRepository
      .createQueryBuilder('roles')
      .where('LOWER(roles.name) = :name', {
        name: roleCreated.name.toLowerCase(),
      })
      .getOne();

    if (roleExists) throw new BadRequestException('Role already exists');

    const newRole = this.roleRepository.create(roleCreated);
    return await this.roleRepository.save(newRole);
  }

  async getRoles(): Promise<RoleEntity[]> {
    return await this.roleRepository.find();
  }

  async getRole(id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException('Rol not found');

    return role;
  }

  async updateRole(
    id: string,
    updatedRole: UpdateRoleDTO,
  ): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException('Rol not found');

    return await this.roleRepository.save({ ...role, ...updatedRole });
  }

  async deleteRole(id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException('Rol not found');

    return await this.roleRepository.remove(role);
  }
}
