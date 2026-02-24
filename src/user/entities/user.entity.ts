import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../__helpers__';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsEnum([Role.Author, Role.Reader])
  role: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
