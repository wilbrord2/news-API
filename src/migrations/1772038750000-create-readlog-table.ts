import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReadlogTable1772038750000 implements MigrationInterface {
  name = 'CreateReadlogTable1772038750000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "readlog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "articleId" uuid NOT NULL, "readerId" uuid, "readAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_readlog_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "readlog" ADD CONSTRAINT "FK_readlog_article" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "readlog" ADD CONSTRAINT "FK_readlog_reader" FOREIGN KEY ("readerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "readlog" DROP CONSTRAINT "FK_readlog_reader"`,
    );
    await queryRunner.query(
      `ALTER TABLE "readlog" DROP CONSTRAINT "FK_readlog_article"`,
    );
    await queryRunner.query(`DROP TABLE "readlog"`);
  }
}
