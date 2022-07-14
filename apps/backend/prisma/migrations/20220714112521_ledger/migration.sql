-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "LedgerCategory" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "LedgerCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "description" TEXT NOT NULL,
    "is_paid" BOOLEAN NOT NULL,
    "due_date" DATE NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "user_id" UUID NOT NULL,
    "ledger_category_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ledger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ledger" ADD CONSTRAINT "ledger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger" ADD CONSTRAINT "ledger_ledger_category_id_fkey" FOREIGN KEY ("ledger_category_id") REFERENCES "LedgerCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
