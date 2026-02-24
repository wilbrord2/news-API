import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
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
import {
  BaseResponseDto,
  CurrentUser,
  HttpExceptionSchema,
  Role,
  Roles,
} from '../__helpers__';
import { QueryArticlesDto } from './dto/query-articles.dto';
import type { Request } from 'express';
import type { AuthUser } from '../__helpers__/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiBody({ type: CreateArticleDto })
  @ApiOperation({ summary: 'create an article' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Author)
  @ApiResponse({
    type: CreateArticleDto,
    status: HttpStatus.OK,
  })
  create(
    @CurrentUser() user: AuthUser,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(user.sub, createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'get public articles' })
  findAll(@Query() query: QueryArticlesDto) {
    return this.articleService.findPublic(query);
  }

  @Get('me')
  @ApiOperation({ summary: 'get my articles' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Author)
  findMine(@CurrentUser() user: AuthUser, @Query() query: QueryArticlesDto) {
    return this.articleService.findMine(user.sub, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get article by id' })
  @UseGuards(OptionalAccessTokenGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser | null,
    @Req() request: Request,
  ) {
    const clientKey = `${request.ip}:${request.header('user-agent') || 'ua'}`;
    return this.articleService.findPublicById(id, user?.sub ?? null, clientKey);
  }

  // api to change article status, only allow author to change their own article status
  @Patch(':id/status')
  @ApiOperation({ summary: 'update article status' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Author)
  updateStatus(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.articleService.updateStatus(id, user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update article' })
  @ApiBearerAuth('access-token')
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
  @ApiOperation({ summary: 'delete article' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Author)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.articleService.remove(id, user.sub);
  }
}
