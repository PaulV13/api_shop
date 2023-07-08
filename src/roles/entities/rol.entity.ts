import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RolEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
