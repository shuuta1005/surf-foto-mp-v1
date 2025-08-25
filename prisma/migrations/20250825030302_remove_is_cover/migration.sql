/*
  Warnings:

  - You are about to drop the column `isCover` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentIntentId` on the `Purchase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "isCover";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "stripePaymentIntentId",
ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "refunded" BOOLEAN NOT NULL DEFAULT false;
