import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ForQueryParams } from '../../__helpers__';

export class QueryArticlesDto {
  @IsOptional()
  @Transform(ForQueryParams.forOptionalNumber)
  @IsInt()
  @Min(1)
  pageNumber?: number = 1;

  @IsOptional()
  @Transform(ForQueryParams.forOptionalNumber)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @IsOptional()
  @Transform(ForQueryParams.forOptionalString)
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(ForQueryParams.forOptionalString)
  @IsString()
  author?: string;

  @IsOptional()
  @Transform(ForQueryParams.forOptionalString)
  @IsString()
  q?: string;

  @IsOptional()
  @Transform(ForQueryParams.forOptionalBoolean)
  includeDeleted?: boolean;
}
