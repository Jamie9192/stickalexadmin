import { BaseEntity, ProductVariant } from "@medusajs/medusa";
export declare enum MediaType {
    MAIN = "main",
    PREVIEW = "preview"
}
export declare class ProductMedia extends BaseEntity {
    name: string;
    type: MediaType;
    file_key: string;
    mime_type: string;
    variant_id: string;
    variant?: ProductVariant;
    private beforeInsert;
}
