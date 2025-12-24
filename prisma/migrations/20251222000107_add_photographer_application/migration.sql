-- CreateEnum
CREATE TYPE "PhotographerStatus" AS ENUM ('NONE', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "applicationSubmittedAt" TIMESTAMP(3),
ADD COLUMN     "photographerStatus" "PhotographerStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "portfolioLink" TEXT;
