-- AlterTable
ALTER TABLE "public"."Gallery" ADD COLUMN     "status" "public"."GalleryStatus" NOT NULL DEFAULT 'PENDING';
