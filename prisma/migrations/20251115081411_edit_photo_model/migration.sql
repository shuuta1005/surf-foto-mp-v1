/*
  Warnings:

  - You are about to drop the column `currency` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `photographerId` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedAt` on the `Photo` table. All the data in the column will be lost.
  - Made the column `originalUrl` on table `Photo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Photo" DROP CONSTRAINT "Photo_photographerId_fkey";

-- AlterTable
ALTER TABLE "public"."Photo" DROP COLUMN "currency",
DROP COLUMN "isActive",
DROP COLUMN "photographerId",
DROP COLUMN "status",
DROP COLUMN "uploadedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "originalUrl" SET NOT NULL,
ALTER COLUMN "price" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."Photo" ADD CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
