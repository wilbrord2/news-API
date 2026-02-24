import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Readlog } from './entities/readlog.entity';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreateReadlogDto } from './dto/create-readlog.dto';
import { UpdateReadlogDto } from './dto/update-readlog.dto';

@Injectable()
export class ReadlogService {
  private readonly refreshProtectionWindowMs = 10_000;

  private readonly recentReadKeys = new Map<string, number>();

  constructor(
    @InjectRepository(Readlog)
    private readonly readlogRepository: Repository<Readlog>,
    private readonly analyticsService: AnalyticsService,
  ) {}

  private shouldTrackRead(
    articleId: string,
    readerId: string | null,
    clientKey?: string,
  ): boolean {
    const actorKey = readerId ?? clientKey ?? 'guest';
    const key = `${articleId}:${actorKey}`;
    const now = Date.now();
    const lastRead = this.recentReadKeys.get(key);

    if (lastRead && now - lastRead < this.refreshProtectionWindowMs) {
      return false;
    }

    this.recentReadKeys.set(key, now);

    if (this.recentReadKeys.size > 10_000) {
      const cutOff = now - this.refreshProtectionWindowMs;

      for (const [entryKey, entryTime] of this.recentReadKeys.entries()) {
        if (entryTime < cutOff) {
          this.recentReadKeys.delete(entryKey);
        }
      }
    }

    return true;
  }

  async createReadEvent(
    articleId: string,
    readerId: string | null,
  ): Promise<void> {
    try {
      const readEvent = this.readlogRepository.create({
        articleId,
        readerId,
      });

      await this.readlogRepository.save(readEvent);
      await this.analyticsService.enqueueAggregation(
        readEvent.articleId,
        readEvent.readAt,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  trackReadNonBlocking(
    articleId: string,
    readerId: string | null,
    clientKey?: string,
  ): void {
    if (!this.shouldTrackRead(articleId, readerId, clientKey)) {
      return;
    }

    setImmediate(() => {
      this.createReadEvent(articleId, readerId).catch((error) => {
        console.log('Failed to store read log', error);
      });
    });
  }

  create(_createReadlogDto: CreateReadlogDto) {
    return 'This action adds a new readlog';
  }

  findAll() {
    return `This action returns all readlog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} readlog`;
  }

  update(id: number, updateReadlogDto: UpdateReadlogDto) {
    void updateReadlogDto;
    return `This action updates a #${id} readlog`;
  }

  remove(id: number) {
    return `This action removes a #${id} readlog`;
  }
}
