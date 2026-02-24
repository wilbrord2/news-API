import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from './entities/analytics.entity';
import { Readlog } from '../readlog/entities/readlog.entity';
import { Article } from '../article/entities/article.entity';
import { PaginatedResponseDto } from '../__helpers__';

@Injectable()
export class AnalyticsService {
  private readonly aggregationQueue = new Set<string>();

  private queueScheduled = false;

  constructor(
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
    @InjectRepository(Readlog)
    private readonly readlogRepository: Repository<Readlog>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  private toGmtDay(value: Date): string {
    return value.toISOString().slice(0, 10);
  }

  async enqueueAggregation(articleId: string, readAt: Date): Promise<void> {
    const gmtDate = this.toGmtDay(readAt);
    this.aggregationQueue.add(`${articleId}::${gmtDate}`);

    if (this.queueScheduled) {
      return;
    }

    this.queueScheduled = true;

    setTimeout(() => {
      this.processQueuedAggregations().catch((error) => {
        console.log('Aggregation queue processing failed', error);
      });
    }, 0);
  }

  private async processQueuedAggregations(): Promise<void> {
    const jobs = Array.from(this.aggregationQueue.values());
    this.aggregationQueue.clear();

    for (const job of jobs) {
      const [articleId, date] = job.split('::');
      await this.aggregateArticleForDate(articleId, date);
    }

    this.queueScheduled = false;
  }

  async aggregateArticleForDate(
    articleId: string,
    date: string,
  ): Promise<void> {
    try {
      const count = await this.readlogRepository
        .createQueryBuilder('readlog')
        .where('readlog.articleId = :articleId', { articleId })
        .andWhere(`DATE(readlog.readAt AT TIME ZONE 'GMT') = :date`, { date })
        .getCount();

      if (count === 0) {
        return;
      }

      await this.analyticsRepository
        .createQueryBuilder()
        .insert()
        .into(Analytics)
        .values({
          articleId,
          viewCount: count,
          date: new Date(`${date}T00:00:00.000Z`),
        })
        .orUpdate(['viewCount'], ['articleId', 'date'])
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getAuthorDashboard(
    authorId: string,
    pageNumber = 1,
    pageSize = 10,
  ): Promise<PaginatedResponseDto<unknown>> {
    try {
      const skip = (pageNumber - 1) * pageSize;

      const query = this.articleRepository
        .createQueryBuilder('article')
        .leftJoin(
          Analytics,
          'daily_analytics',
          'daily_analytics.articleId = article.id',
        )
        .select('article.id', 'id')
        .addSelect('article.title', 'title')
        .addSelect('article.createdAt', 'createdAt')
        .addSelect('COALESCE(SUM(daily_analytics.viewCount), 0)', 'totalViews')
        .where('article.authorId = :authorId', { authorId })
        .andWhere('article.deletedAt IS NULL')
        .groupBy('article.id')
        .addGroupBy('article.title')
        .addGroupBy('article.createdAt')
        .orderBy('article.createdAt', 'DESC')
        .offset(skip)
        .limit(pageSize);

      const [rows, totalSize] = await Promise.all([
        query.getRawMany(),
        this.articleRepository
          .createQueryBuilder('article')
          .where('article.authorId = :authorId', { authorId })
          .andWhere('article.deletedAt IS NULL')
          .getCount(),
      ]);

      const mappedRows = rows.map((row) => ({
        id: row.id,
        title: row.title,
        createdAt: row.createdAt,
        totalViews: Number(row.totalViews),
      }));

      return PaginatedResponseDto.ok(
        'Author dashboard fetched successfully',
        mappedRows,
        pageNumber,
        pageSize,
        totalSize,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
