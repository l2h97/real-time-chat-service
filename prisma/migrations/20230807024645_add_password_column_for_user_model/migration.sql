-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHashed" TEXT,
ADD COLUMN     "salt" TEXT;
