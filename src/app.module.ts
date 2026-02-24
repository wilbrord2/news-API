import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModuleOptions } from './app.module.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { ReadlogModule } from './readlog/readlog.module';
import { AnalyticsModule } from './analytics/analytics.module';
import typeorm from './config/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...configModuleOptions,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm')!,
    }),
    AuthModule,
    UserModule,
    ArticleModule,
    ReadlogModule,
    AnalyticsModule,
   
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

