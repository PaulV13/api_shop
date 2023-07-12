import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderAndOrderItemEntity1689100191795 implements MigrationInterface {
    name = 'CreateOrderAndOrderItemEntity1689100191795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_item_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "price" integer NOT NULL, "product_id" uuid, "order_id" uuid, CONSTRAINT "PK_c12e105219e59720676c72957dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "total_price" integer NOT NULL, "user_id" uuid, CONSTRAINT "PK_428b558237e70f2cd8462e1bea1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_item_entity" ADD CONSTRAINT "FK_b8f621e85f144d499dd6bdd936e" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_entity" ADD CONSTRAINT "FK_3fc9facca59c33ee8dcc5a88171" FOREIGN KEY ("order_id") REFERENCES "order_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_entity" ADD CONSTRAINT "FK_48f0f1750ccf067978f4c92d4ff" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_entity" DROP CONSTRAINT "FK_48f0f1750ccf067978f4c92d4ff"`);
        await queryRunner.query(`ALTER TABLE "order_item_entity" DROP CONSTRAINT "FK_3fc9facca59c33ee8dcc5a88171"`);
        await queryRunner.query(`ALTER TABLE "order_item_entity" DROP CONSTRAINT "FK_b8f621e85f144d499dd6bdd936e"`);
        await queryRunner.query(`DROP TABLE "order_entity"`);
        await queryRunner.query(`DROP TABLE "order_item_entity"`);
    }

}
