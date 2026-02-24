import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { User } from '../user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Article } from '../article/entities/article.entity';
import { Readlog } from '../readlog/entities/readlog.entity';
import { Analytics } from '../analytics/entities/analytics.entity';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [User, Article, Readlog, Analytics],
  logging: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
