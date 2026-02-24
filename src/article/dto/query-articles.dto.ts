import { Expose, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ForQueryParams } from '../../__helpers__';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryArticlesDto {
  @IsOptional()
  @Transform(ForQueryParams.forOptionalNumber)
  @IsInt()
  @Min(1)
  @Expose()
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  pageNumber: number = 1;

  @IsOptional()
  @Transform(ForQueryParams.forOptionalNumber)
  @IsInt()
  @Min(1)
  @Max(100)
  @Expose()
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  pageSize: number = 10;

  @IsOptional()
  @Transform(ForQueryParams.forOptionalString)
  @IsString()
  @Expose()
  @ApiPropertyOptional({
    description: 'Filter articles by category',
    example: 'Technology',
  })
  category: string;

  @IsOptional()
  @Transform(ForQueryParams.forOptionalString)
  @IsString()
  @Expose()
  @ApiPropertyOptional({
    description: 'Filter articles by author name',
    example: 'John',
  })
  author: string;

  @IsOptional()
  @Transform(ForQueryParams.forOptionalString)
  @IsString()
  @Expose()
  @ApiPropertyOptional({
    description: 'Search keyword for article title',
    example: 'nestjs',
  })
  q: string;

  @IsOptional()
  @Transform(ForQueryParams.forOptionalBoolean)
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Include soft-deleted articles',
    example: false,
  })
  includeDeleted: boolean;
}
