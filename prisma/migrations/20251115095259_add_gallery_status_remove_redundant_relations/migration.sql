/*
  Warnings:

  - You are about to drop the column `userId` on the `Photo` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."GalleryStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."Photo" DROP CONSTRAINT "Photo_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PricingTier" DROP CONSTRAINT "PricingTier_photographerId_fkey";

-- AlterTable
ALTER TABLE "public"."Photo" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."PricingTier" ADD COLUMN     "galleryId" TEXT;

-- DropEnum
DROP TYPE "public"."PhotoStatus";

-- AddForeignKey
ALTER TABLE "public"."PricingTier" ADD CONSTRAINT "PricingTier_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "public"."Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;
