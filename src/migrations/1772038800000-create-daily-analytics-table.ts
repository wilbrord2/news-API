import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDailyAnalyticsTable1772038800000 implements MigrationInterface {
  name = 'CreateDailyAnalyticsTable1772038800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "daily_analytics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "articleId" uuid NOT NULL, "viewCount" integer NOT NULL DEFAULT '0', "date" date NOT NULL, CONSTRAINT "UQ_daily_analytics_article_date" UNIQUE ("articleId", "date"), CONSTRAINT "PK_daily_analytics_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "daily_analytics" ADD CONSTRAINT "FK_daily_analytics_article" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "daily_analytics" DROP CONSTRAINT "FK_daily_analytics_article"`,
    );
    await queryRunner.query(`DROP TABLE "daily_analytics"`);
  }
}
