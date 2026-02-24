import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { User } from '../../user/entities/user.entity';

export enum ArticleStatus {
  Draft = 'draft',
  Published = 'published',
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  title: string;

  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  content: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.Draft,
  })
  @IsEnum(ArticleStatus)
  status: ArticleStatus;

  @Column({ type: 'uuid' })
  authorId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'authorId' })
  author: User;
}
