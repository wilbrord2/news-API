import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  content: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;
}
