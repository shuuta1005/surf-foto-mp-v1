/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Gallery` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Gallery` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Gallery` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Photo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "coverImage",
DROP COLUMN "location",
DROP COLUMN "name",
ADD COLUMN     "area" TEXT,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "photographerId" TEXT,
ADD COLUMN     "prefecture" TEXT,
ADD COLUMN     "surfSpot" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "title",
ADD COLUMN     "isCover" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_photographerId_fkey" FOREIGN KEY ("photographerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
