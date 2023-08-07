/*
  Warnings:

  - You are about to drop the column `coverImage` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "coverImage",
ADD COLUMN     "coverImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
