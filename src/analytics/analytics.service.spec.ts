import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Analytics } from './entities/analytics.entity';
import { Readlog } from '../readlog/entities/readlog.entity';
import { Article } from '../article/entities/article.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(Analytics),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Readlog),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Article),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
