-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "hasVideo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "mediaType" TEXT NOT NULL DEFAULT 'image';
