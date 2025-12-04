/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Gallery` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `sessionTime` on table `Gallery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `galleryId` on table `PricingTier` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PricingTier" DROP CONSTRAINT "PricingTier_galleryId_fkey";

-- AlterTable
ALTER TABLE "public"."Gallery" DROP COLUMN "isPublic",
ALTER COLUMN "sessionTime" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Photo" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "public"."PricingTier" ALTER COLUMN "galleryId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Cart";

-- DropTable
DROP TABLE "public"."CartItem";

-- AddForeignKey
ALTER TABLE "public"."PricingTier" ADD CONSTRAINT "PricingTier_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "public"."Gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
