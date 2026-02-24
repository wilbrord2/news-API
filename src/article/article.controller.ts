import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  AccessTokenGuard,
  OptionalAccessTokenGuard,
  RbacGuard,
} from '../auth/guards';
import { CurrentUser, Role, Roles } from '../__helpers__';
import { QueryArticlesDto } from './dto/query-articles.dto';
import type { Request } from 'express';
import type { AuthUser } from '../__helpers__/decorators/current-user.decorator';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Author)
  create(
    @CurrentUser() user: AuthUser,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(user.sub, createArticleDto);
  }

  @Get()
  findAll(@Query() query: QueryArticlesDto) {
    return this.articleService.findPublic(query);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Author)
  findMine(@CurrentUser() user: AuthUser, @Query() query: QueryArticlesDto) {
    return this.articleService.findMine(user.sub, query);
  }

  @Get(':id')
  @UseGuards(OptionalAccessTokenGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser | null,
    @Req() request: Request,
  ) {
    const clientKey = `${request.ip}:${request.header('user-agent') || 'ua'}`;
    return this.articleService.findPublicById(id, user?.sub ?? null, clientKey);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Author)
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(id, user.sub, updateArticleDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Author)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.articleService.remove(id, user.sub);
  }
}
