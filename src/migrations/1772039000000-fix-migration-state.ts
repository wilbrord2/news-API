import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixMigrationState1772039000000 implements MigrationInterface {
  name = 'FixMigrationState1772039000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove the orphaned migration record from the database
    // This prevents TypeORM from trying to re-run a migration file that no longer exists
    await queryRunner.query(
      `DELETE FROM "migrations" WHERE "name" = 'MigratingTableTable1771936146946'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No down migration needed for this repair
  }
}
