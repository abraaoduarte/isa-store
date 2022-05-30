-- CreateTable
CREATE TABLE "product_images" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "product_variation_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_images_product_variation_id_key" ON "product_images"("product_variation_id");

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_variation_id_fkey" FOREIGN KEY ("product_variation_id") REFERENCES "product_variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
