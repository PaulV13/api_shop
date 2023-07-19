import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleEntity } from '../../roles/entities/rol.entity';
import { UpdateRoleUserDTO } from '../dtos/role-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async createUser(user: CreateUserDTO): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;

    const role = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name = :name', { name: 'User' })
      .getOne();
    if (!role) throw new NotFoundException(`Role not found`);

    const newUser = this.userRepository.create({
      role: role,
      ...user,
    });

    return await this.userRepository.save(newUser);
  }

  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .select(['user', 'role.name'])
      .getMany();
    return users;
  }

  async getUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoin('user.role', 'role')
      .select(['user', 'role.name'])
      .getOne();

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) = :username', {
        username: username.toLowerCase(),
      })
      .orWhere('LOWER(user.email) = :email', {
        email: username.toLocaleLowerCase(),
      })
      .leftJoin('user.role', 'role')
      .select(['user', 'role.name'])
      .getOne();

    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async getUsersByRole(roleName: string): Promise<UserEntity[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .where('LOWER(role.name) = :name', { name: roleName.toLocaleLowerCase() })
      .select(['user', 'role.name'])
      .getMany();
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .leftJoin('user.role', 'role')
      .select(['user', 'role.name'])
      .getOne();

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async changeUserRole(
    id: string,
    roleUpdated: UpdateRoleUserDTO,
  ): Promise<string> {
    const role = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name = :name', { name: roleUpdated.roleName })
      .getOne();

    if (!role) throw new NotFoundException('Rol not found');

    const userUpdated = await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ role: role })
      .where('id = :id', { id: id })
      .execute();

    if (userUpdated.affected === 0)
      throw new BadRequestException('Error updating user');

    return 'User role updated successfully';
  }

  async updateUser(
    id: string,
    updatedUser: UpdateUserDTO,
  ): Promise<UserEntity> {
    const user = await this.getUser(id);
    if (!user) throw new NotFoundException(`User not found`);

    return await this.userRepository.save({ ...user, ...updatedUser });
  }

  async deleteUser(id: string): Promise<UserEntity> {
    const user = await this.getUser(id);
    if (!user) throw new NotFoundException(`User not found`);

    return await this.userRepository.remove(user);
  }
}
