import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article, ArticleStatus } from './entities/article.entity';
import { Repository } from 'typeorm';
import { BaseResponseDto, PaginatedResponseDto } from '../__helpers__';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { ReadlogService } from '../readlog/readlog.service';
import {
  CreatedArticleResponseDto,
  MineArticleListItemDto,
  PublicArticleListItemDto,
} from './dto/article-response.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly readlogService: ReadlogService,
  ) {}

  async create(
    authorId: string,
    createArticleDto: CreateArticleDto,
  ): Promise<BaseResponseDto<CreatedArticleResponseDto>> {
    try {
      const article = this.articleRepository.create({
        ...createArticleDto,
        authorId,
        status: ArticleStatus.Draft,
      });

      const saved = await this.articleRepository.save(article);

      return BaseResponseDto.ok('Article created successfully', {
        id: saved.id,
        title: saved.title,
        category: saved.category,
        status: saved.status,
        authorId: saved.authorId,
        createdAt: saved.createdAt,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findPublic(
    query: QueryArticlesDto,
  ): Promise<PaginatedResponseDto<PublicArticleListItemDto>> {
    try {
      const pageNumber = query.pageNumber || 1;
      const pageSize = query.pageSize || 10;
      const skip = (pageNumber - 1) * pageSize;

      const qb = this.articleRepository
        .createQueryBuilder('article')
        .leftJoin('article.author', 'author')
        .where('article.status = :status', { status: ArticleStatus.Published })
        .andWhere('article.deletedAt IS NULL');

      if (query.category) {
        qb.andWhere('article.category = :category', {
          category: query.category,
        });
      }

      if (query.author) {
        qb.andWhere('LOWER(author.name) LIKE LOWER(:author)', {
          author: `%${query.author}%`,
        });
      }

      if (query.q) {
        qb.andWhere('LOWER(article.title) LIKE LOWER(:keyword)', {
          keyword: `%${query.q}%`,
        });
      }

      const [items, totalSize] = await qb
        .select([
          'article.id',
          'article.title',
          'article.category',
          'article.status',
          'article.createdAt',
          'author.id',
          'author.name',
        ])
        .orderBy('article.createdAt', 'DESC')
        .offset(skip)
        .limit(pageSize)
        .getManyAndCount();

      const object = items.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        status: item.status,
        createdAt: item.createdAt,
        author: item.author
          ? {
              id: item.author.id,
              name: item.author.name,
            }
          : null,
      }));

      return PaginatedResponseDto.ok(
        'Articles fetched successfully',
        object,
        pageNumber,
        pageSize,
        totalSize,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findMine(
    authorId: string,
    query: QueryArticlesDto,
  ): Promise<PaginatedResponseDto<MineArticleListItemDto>> {
    try {
      const pageNumber = query.pageNumber || 1;
      const pageSize = query.pageSize || 10;
      const skip = (pageNumber - 1) * pageSize;

      const qb = this.articleRepository
        .createQueryBuilder('article')
        .where('article.authorId = :authorId', { authorId });

      if (!query.includeDeleted) {
        qb.andWhere('article.deletedAt IS NULL');
      }

      if (query.category) {
        qb.andWhere('article.category = :category', {
          category: query.category,
        });
      }

      if (query.q) {
        qb.andWhere('LOWER(article.title) LIKE LOWER(:keyword)', {
          keyword: `%${query.q}%`,
        });
      }

      const [items, totalSize] = await qb
        .orderBy('article.createdAt', 'DESC')
        .offset(skip)
        .limit(pageSize)
        .getManyAndCount();

      const object = items.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        status: item.status,
        createdAt: item.createdAt,
        deletedAt: item.deletedAt,
        isDeleted: !!item.deletedAt,
      }));

      return PaginatedResponseDto.ok(
        'Author articles fetched successfully',
        object,
        pageNumber,
        pageSize,
        totalSize,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findPublicById(
    id: string,
    readerId: string | null,
    clientKey?: string,
  ): Promise<BaseResponseDto<unknown>> {
    try {
      const article = await this.articleRepository.findOne({
        where: {
          id,
          status: ArticleStatus.Published,
        },
        relations: {
          author: true,
        },
      });

      if (!article || article.deletedAt) {
        return BaseResponseDto.fail('News article no longer available', [
          'Article is deleted or unavailable.',
        ]);
      }

      this.readlogService.trackReadNonBlocking(id, readerId, clientKey);

      return BaseResponseDto.ok('Article fetched successfully', {
        id: article.id,
        title: article.title,
        content: article.content,
        category: article.category,
        status: article.status,
        createdAt: article.createdAt,
        author: article.author
          ? {
              id: article.author.id,
              name: article.author.name,
            }
          : null,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(
    articleId: string,
    authorId: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<BaseResponseDto<unknown>> {
    try {
      const article = await this.articleRepository.findOne({
        where: { id: articleId },
      });

      if (!article || article.deletedAt) {
        throw new NotFoundException('Article not found');
      }

      if (article.authorId !== authorId) {
        throw new ForbiddenException('Forbidden');
      }

      Object.assign(article, updateArticleDto);
      const updated = await this.articleRepository.save(article);

      return BaseResponseDto.ok('Article updated successfully', {
        id: updated.id,
        title: updated.title,
        category: updated.category,
        status: updated.status,
      });
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(
    articleId: string,
    authorId: string,
  ): Promise<BaseResponseDto<null>> {
    try {
      const article = await this.articleRepository.findOne({
        where: { id: articleId },
      });

      if (!article || article.deletedAt) {
        throw new NotFoundException('Article not found');
      }

      if (article.authorId !== authorId) {
        throw new ForbiddenException('Forbidden');
      }

      article.deletedAt = new Date();
      await this.articleRepository.save(article);

      return BaseResponseDto.ok('Article deleted successfully', null);
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateStatus(
    articleId: string,
    authorId: string,
  ): Promise<BaseResponseDto<unknown>> {
    try {
      const article = await this.articleRepository.findOne({
        where: { id: articleId },
      });

      if (!article || article.deletedAt) {
        throw new NotFoundException('Article not found');
      }

      if (article.authorId !== authorId) {
        throw new ForbiddenException('Forbidden');
      }

      article.status = ArticleStatus.Published;
      const updated = await this.articleRepository.save(article);

      return BaseResponseDto.ok('Article status updated successfully', {
        id: updated.id,
        title: updated.title,
        category: updated.category,
        status: updated.status,
      });
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
