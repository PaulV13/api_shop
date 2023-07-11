import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { RolEntity } from 'src/roles/entities/rol.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RolEntity)
    private readonly roleRepository: Repository<RolEntity>,
  ) {}

  async create(user: CreateUserDTO): Promise<InsertResult> {
    const passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;

    const role = await this.roleRepository.findOneBy({ id: user.roleId });
    if (!role) throw new BadRequestException(`Role not found`);

    return await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        role: role,
      })
      .execute();
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .getMany();
  }

  async getUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ id })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();

    if (!user) throw new BadRequestException(`User not found`);

    return user;
  }

  async updateUser(
    id: string,
    updatedUser: UpdateUserDTO,
  ): Promise<UpdateResult> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ id })
      .getOne();
    if (!user) throw new BadRequestException(`User not found`);

    return await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set(updatedUser)
      .where({ id })
      .execute();
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    const user = await this.userRepository
      .createQueryBuilder()
      .where({ id })
      .getOne();
    if (!user) throw new BadRequestException(`User not found`);

    return await this.userRepository
      .createQueryBuilder('user')
      .delete()
      .from(UserEntity)
      .where('id = :id', { id })
      .execute();
  }
}
