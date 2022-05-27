-- CreateTable
CREATE TABLE "product_variations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "quantity" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "user_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "size_id" UUID NOT NULL,
    "color_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_variations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variations_user_id_key" ON "product_variations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variations_size_id_key" ON "product_variations"("size_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variations_color_id_key" ON "product_variations"("color_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variations_product_id_key" ON "product_variations"("product_id");

-- AddForeignKey
ALTER TABLE "product_variations" ADD CONSTRAINT "product_variations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variations" ADD CONSTRAINT "product_variations_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variations" ADD CONSTRAINT "product_variations_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variations" ADD CONSTRAINT "product_variations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
