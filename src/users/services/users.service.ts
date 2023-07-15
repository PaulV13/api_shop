import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleEntity } from '../../roles/entities/rol.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(user: CreateUserDTO): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;

    const role = await this.roleRepository.findOneBy({ id: user.roleId });
    if (!role) throw new NotFoundException(`Role not found`);

    const newUser = this.userRepository.create({
      role: role,
      ...user,
    });

    return await this.userRepository.save(newUser);
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      select: {
        role: {
          name: true,
        },
      },
      relations: {
        role: true,
      },
    });
  }

  async getUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      select: {
        role: {
          name: true,
        },
      },
      where: {
        id: id,
      },
      relations: {
        role: true,
      },
    });

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async updateUser(
    id: string,
    updatedUser: UpdateUserDTO,
  ): Promise<UserEntity> {
    const user = this.getUser(id);
    if (!user) throw new NotFoundException(`User not found`);

    return await this.userRepository.save({ ...user, ...updatedUser });
  }

  async deleteUser(id: string): Promise<UserEntity> {
    const user = await this.getUser(id);
    if (!user) throw new NotFoundException(`User not found`);

    return await this.userRepository.remove(user);
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }
}
