import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  @ApiProperty({
    type: 'string',
    description: 'Title of the article',
    example: 'Understanding NestJS: A Comprehensive Guide',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  @ApiProperty({
    type: 'string',
    description: 'Content of the article',
    example:
      'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. It is built with TypeScript and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming). In this comprehensive guide, we will explore the core features of NestJS, its architecture, and how to get started with building your first application.',
  })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Category of the article',
    example: 'Technology',
  })
  category: string;
}
