import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedAtColumnTable1771967223500 implements MigrationInterface {
    name = 'CreatedAtColumnTable1771967223500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_article_author"`);
        await queryRunner.query(`ALTER TABLE "readlog" DROP CONSTRAINT "FK_readlog_article"`);
        await queryRunner.query(`ALTER TABLE "readlog" DROP CONSTRAINT "FK_readlog_reader"`);
        await queryRunner.query(`ALTER TABLE "daily_analytics" DROP CONSTRAINT "FK_daily_analytics_article"`);
        await queryRunner.query(`ALTER TABLE "daily_analytics" DROP CONSTRAINT "UQ_daily_analytics_article_date"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "daily_analytics" ADD CONSTRAINT "UQ_be53c86dfb7e09d5b97002fb4fe" UNIQUE ("articleId", "date")`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "readlog" ADD CONSTRAINT "FK_241fcc9981b7bbfb3c8c5ff58dd" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "readlog" ADD CONSTRAINT "FK_76d7578c64eb29e1377d9400adf" FOREIGN KEY ("readerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daily_analytics" ADD CONSTRAINT "FK_555990e44aba82482ee9d873ac0" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "daily_analytics" DROP CONSTRAINT "FK_555990e44aba82482ee9d873ac0"`);
        await queryRunner.query(`ALTER TABLE "readlog" DROP CONSTRAINT "FK_76d7578c64eb29e1377d9400adf"`);
        await queryRunner.query(`ALTER TABLE "readlog" DROP CONSTRAINT "FK_241fcc9981b7bbfb3c8c5ff58dd"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`);
        await queryRunner.query(`ALTER TABLE "daily_analytics" DROP CONSTRAINT "UQ_be53c86dfb7e09d5b97002fb4fe"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "daily_analytics" ADD CONSTRAINT "UQ_daily_analytics_article_date" UNIQUE ("articleId", "date")`);
        await queryRunner.query(`ALTER TABLE "daily_analytics" ADD CONSTRAINT "FK_daily_analytics_article" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "readlog" ADD CONSTRAINT "FK_readlog_reader" FOREIGN KEY ("readerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "readlog" ADD CONSTRAINT "FK_readlog_article" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_article_author" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
