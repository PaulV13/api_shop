import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolEntity } from '../entities/rol.entity';
import { Repository } from 'typeorm';
import { CreateRolDTO } from '../dtos/create-rol.dto';
import { updateRolDTO } from '../dtos/update-rol.dto';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolEntity)
    private readonly rolRepository: Repository<RolEntity>,
  ) {}

  async create(rolCreated: CreateRolDTO): Promise<RolEntity> {
    const rol = await this.rolRepository.findOneBy({ name: rolCreated.name });

    if (rol) throw new BadRequestException('Role already exists');

    const newRol = this.rolRepository.create(rolCreated);
    return await this.rolRepository.save(newRol);
  }

  async getRoles(): Promise<RolEntity[]> {
    return await this.rolRepository.find();
  }

  async getRol(id: string): Promise<RolEntity> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid rol id');
    }

    const rol = await this.rolRepository.findOneBy({ id });
    if (!rol) throw new BadRequestException('Rol not found');

    return rol;
  }

  async updateRol(id: string, newRol: updateRolDTO): Promise<any> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid rol id');
    }

    const rol = await this.rolRepository.findOneBy({ id });
    if (!rol) throw new BadRequestException('Rol not found');

    return await this.rolRepository.update(id, newRol);
  }

  async deleteRol(id: string): Promise<any> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid rol id');
    }

    const rol = await this.rolRepository.findOneBy({ id });
    if (!rol) throw new BadRequestException('Rol not found');

    return await this.rolRepository.delete(id);
  }
}