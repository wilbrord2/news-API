import { Test, TestingModule } from '@nestjs/testing';
import { ReadlogController } from './readlog.controller';
import { ReadlogService } from './readlog.service';

describe('ReadlogController', () => {
  let controller: ReadlogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadlogController],
      providers: [
        {
          provide: ReadlogService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReadlogController>(ReadlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
