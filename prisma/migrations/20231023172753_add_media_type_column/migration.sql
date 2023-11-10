-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "type" "MediaType" NOT NULL DEFAULT 'IMAGE';
