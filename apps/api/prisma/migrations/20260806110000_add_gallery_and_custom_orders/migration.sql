-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "aspect" TEXT NOT NULL DEFAULT 'aspect-square',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomOrderRequest" (
    "id" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "fruits" TEXT[],
    "toppings" TEXT[],
    "packaging" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "eventDate" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomOrderRequest_pkey" PRIMARY KEY ("id")
);
