-- CreateTable
CREATE TABLE "public"."PricingTier" (
    "id" TEXT NOT NULL,
    "photographerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricingTier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PricingTier" ADD CONSTRAINT "PricingTier_photographerId_fkey" FOREIGN KEY ("photographerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
