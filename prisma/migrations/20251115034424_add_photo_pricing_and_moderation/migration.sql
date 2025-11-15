/*
  Warnings:

  - Added the required column `photographerId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PhotoStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Photo" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'JPY',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "photographerId" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "status" "public"."PhotoStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "public"."Photo" ADD CONSTRAINT "Photo_photographerId_fkey" FOREIGN KEY ("photographerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
