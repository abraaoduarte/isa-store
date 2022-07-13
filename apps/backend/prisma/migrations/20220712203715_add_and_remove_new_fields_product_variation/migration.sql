/*
  Warnings:

  - You are about to drop the column `quantity` on the `product_variations` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `products` table. All the data in the column will be lost.
  - Added the required column `inventory_quantity` to the `product_variations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `product_variations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `product_variations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountable` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "product_images_product_variation_id_key";

-- AlterTable
ALTER TABLE "product_variations" DROP COLUMN "quantity",
ADD COLUMN     "inventory_quantity" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "discount",
DROP COLUMN "price",
DROP COLUMN "quantity",
ADD COLUMN     "discountable" BOOLEAN NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;
