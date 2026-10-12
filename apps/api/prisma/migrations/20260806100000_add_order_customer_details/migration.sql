-- AlterTable
ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT,
ADD COLUMN "customerPhone" TEXT,
ADD COLUMN "deliveryAddress" TEXT,
ADD COLUMN "deliveryMethod" TEXT,
ADD COLUMN "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "notes" TEXT;
