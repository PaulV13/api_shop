import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { RolEntity } from '../../roles/entities/rol.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RolEntity)
    private readonly roleRepository: Repository<RolEntity>,
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

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async updateUser(
    id: string,
    updatedUser: UpdateUserDTO,
  ): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ id })
      .getOne();
    if (!user) throw new NotFoundException(`User not found`);

    const newUser = await this.userRepository.update(id, updatedUser);

    if (newUser.affected === 0)
      throw new BadRequestException('Error to updated user');

    return await this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder()
      .where({ id })
      .getOne();
    if (!user) throw new NotFoundException(`User not found`);

    const userDeleted = await this.userRepository.remove(user);
    return userDeleted;
  }
}
