/*
  Warnings:

  - You are about to drop the column `name` on the `sizes` table. All the data in the column will be lost.
  - Added the required column `size` to the `sizes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `sizes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
DROP TYPE IF EXISTS "SizeType";

CREATE TYPE "SizeType" AS ENUM ('NUMERIC', 'LETTER');

-- AlterTable
ALTER TABLE "sizes" RENAME COLUMN "name" TO "size";
ALTER TABLE "sizes" ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" "SizeType" NOT NULL;
