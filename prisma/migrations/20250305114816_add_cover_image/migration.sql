/*
  Warnings:

  - You are about to drop the column `photographerId` on the `Gallery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "photographerId",
ADD COLUMN     "coverImage" TEXT;
