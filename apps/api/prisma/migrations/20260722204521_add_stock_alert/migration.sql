-- CreateTable
CREATE TABLE "StockAlert" (
    "id" TEXT NOT NULL,
    "dot" TEXT NOT NULL DEFAULT 'bg-error',
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "action" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockAlert_pkey" PRIMARY KEY ("id")
);
