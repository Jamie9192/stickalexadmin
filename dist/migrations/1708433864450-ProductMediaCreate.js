"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMediaCreate1708433864450 = void 0;
class ProductMediaCreate1708433864450 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."product_media_type_enum" AS ENUM('main', 'preview')`);
        await queryRunner.query(`CREATE TABLE "product_media" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" "public"."product_media_type_enum" NOT NULL DEFAULT 'main', "file_key" character varying NOT NULL, "mime_type" character varying NOT NULL, "variant_id" character varying NOT NULL, CONSTRAINT "PK_09d4639de8082a32aa27f3ac9a6" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "product_media"`);
        await queryRunner.query(`DROP TYPE "public"."product_media_type_enum"`);
    }
}
exports.ProductMediaCreate1708433864450 = ProductMediaCreate1708433864450;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcwODQzMzg2NDQ1MC1Qcm9kdWN0TWVkaWFDcmVhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xNzA4NDMzODY0NDUwLVByb2R1Y3RNZWRpYUNyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLCtCQUErQjtJQUNqQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQywyRUFBMkUsQ0FBQyxDQUFBO1FBQ3BHLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQywwZEFBMGQsQ0FBQyxDQUFBO0lBQ3ZmLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCO1FBQ3RDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO1FBQ3JELE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFBO0lBQzNFLENBQUM7Q0FDSjtBQVZELDBFQVVDIn0=