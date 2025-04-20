/*
  Warnings:

  - You are about to drop the column `userId` on the `Gallery` table. All the data in the column will be lost.
  - Made the column `area` on table `Gallery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `Gallery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photographerId` on table `Gallery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `prefecture` on table `Gallery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surfSpot` on table `Gallery` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_photographerId_fkey";

-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_userId_fkey";

-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "userId",
ALTER COLUMN "area" SET NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "photographerId" SET NOT NULL,
ALTER COLUMN "prefecture" SET NOT NULL,
ALTER COLUMN "surfSpot" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_photographerId_fkey" FOREIGN KEY ("photographerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
