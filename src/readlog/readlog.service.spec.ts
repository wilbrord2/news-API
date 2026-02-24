import { Test, TestingModule } from '@nestjs/testing';
import { ReadlogService } from './readlog.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Readlog } from './entities/readlog.entity';
import { AnalyticsService } from '../analytics/analytics.service';

describe('ReadlogService', () => {
  let service: ReadlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadlogService,
        {
          provide: getRepositoryToken(Readlog),
          useValue: {},
        },
        {
          provide: AnalyticsService,
          useValue: { enqueueAggregation: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ReadlogService>(ReadlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
