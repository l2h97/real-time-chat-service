/*
  Warnings:

  - Made the column `profileImageId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileImageId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileImageId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
