-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "sessionCartId" TEXT NOT NULL,
    "userId" TEXT,
    "totalPrice" INTEGER NOT NULL,
    "taxPrice" INTEGER,
    "afterTaxPrice" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "location" TEXT,
    "takenAt" TIMESTAMP(3),
    "photographerId" TEXT,
    "photographerName" TEXT,
    "slug" TEXT,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessionCartId_key" ON "Cart"("sessionCartId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
