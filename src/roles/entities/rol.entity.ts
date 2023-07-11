import { UserEntity } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from '../interfaces/user-rol.interface';
@Entity('roles')
export class RolEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    unique: true,
    default: UserRole.USER,
  })
  name: UserRole;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
