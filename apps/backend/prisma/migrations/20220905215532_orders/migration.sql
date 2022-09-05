-- CreateTable
CREATE TABLE "sell_order" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "note" TEXT,
    "user_id" UUID NOT NULL,
    "total_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sell_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sell_order_items" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "product_variation_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sell_order_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sell_order" ADD CONSTRAINT "sell_order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sell_order_items" ADD CONSTRAINT "sell_order_items_product_variation_id_fkey" FOREIGN KEY ("product_variation_id") REFERENCES "product_variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
