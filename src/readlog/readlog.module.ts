import { Module } from '@nestjs/common';
import { ReadlogService } from './readlog.service';
import { ReadlogController } from './readlog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Readlog } from './entities/readlog.entity';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [TypeOrmModule.forFeature([Readlog]), AnalyticsModule],
  controllers: [ReadlogController],
  providers: [ReadlogService],
  exports: [ReadlogService],
})
export class ReadlogModule {}
