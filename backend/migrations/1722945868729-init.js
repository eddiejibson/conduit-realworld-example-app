const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Init1722945868729 {
    name = 'Init1722945868729'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "bio" text NOT NULL, "image" text NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "body" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "articleId" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "body" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Favorites" ("userId" integer NOT NULL, "articleId" integer NOT NULL, CONSTRAINT "PK_e9fd6980f5bcbc5ded7ef0c6c42" PRIMARY KEY ("userId", "articleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_649880d4eb31b62af8f1f75b6c" ON "Favorites" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3e9f1f73ae19e72b130ed542b6" ON "Favorites" ("articleId") `);
        await queryRunner.query(`CREATE TABLE "Followers" ("userId" integer NOT NULL, "followerId" integer NOT NULL, CONSTRAINT "PK_bf3c5f269b0a8cc0180c1191515" PRIMARY KEY ("userId", "followerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1cc0e60c868c76985e203eb521" ON "Followers" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cccee741c1cf2e3dfe04a00b1f" ON "Followers" ("followerId") `);
        await queryRunner.query(`CREATE TABLE "ArticleTags" ("tagId" integer NOT NULL, "articleId" integer NOT NULL, CONSTRAINT "PK_55baffcde8dd7f914985ef8d82f" PRIMARY KEY ("tagId", "articleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d2062cc50cc60e41b6b37e8fb9" ON "ArticleTags" ("tagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_efe06106c215ea3343aadb4a11" ON "ArticleTags" ("articleId") `);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_a9d18538b896fe2a6762e143bea" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Favorites" ADD CONSTRAINT "FK_649880d4eb31b62af8f1f75b6cc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Favorites" ADD CONSTRAINT "FK_3e9f1f73ae19e72b130ed542b6d" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Followers" ADD CONSTRAINT "FK_1cc0e60c868c76985e203eb521c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Followers" ADD CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ArticleTags" ADD CONSTRAINT "FK_d2062cc50cc60e41b6b37e8fb9a" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ArticleTags" ADD CONSTRAINT "FK_efe06106c215ea3343aadb4a112" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ArticleTags" DROP CONSTRAINT "FK_efe06106c215ea3343aadb4a112"`);
        await queryRunner.query(`ALTER TABLE "ArticleTags" DROP CONSTRAINT "FK_d2062cc50cc60e41b6b37e8fb9a"`);
        await queryRunner.query(`ALTER TABLE "Followers" DROP CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7"`);
        await queryRunner.query(`ALTER TABLE "Followers" DROP CONSTRAINT "FK_1cc0e60c868c76985e203eb521c"`);
        await queryRunner.query(`ALTER TABLE "Favorites" DROP CONSTRAINT "FK_3e9f1f73ae19e72b130ed542b6d"`);
        await queryRunner.query(`ALTER TABLE "Favorites" DROP CONSTRAINT "FK_649880d4eb31b62af8f1f75b6cc"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_a9d18538b896fe2a6762e143bea"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_efe06106c215ea3343aadb4a11"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d2062cc50cc60e41b6b37e8fb9"`);
        await queryRunner.query(`DROP TABLE "ArticleTags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cccee741c1cf2e3dfe04a00b1f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1cc0e60c868c76985e203eb521"`);
        await queryRunner.query(`DROP TABLE "Followers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e9f1f73ae19e72b130ed542b6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_649880d4eb31b62af8f1f75b6c"`);
        await queryRunner.query(`DROP TABLE "Favorites"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
