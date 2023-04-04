/*
  Warnings:

  - Made the column `profileImageId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coverImageId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_coverImageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileImageId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileImageId" SET NOT NULL,
ALTER COLUMN "coverImageId" SET NOT NULL;

-- CreateTable
CREATE TABLE "_connectedUsers" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_connectedUsers_AB_unique" ON "_connectedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_connectedUsers_B_index" ON "_connectedUsers"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_connectedUsers" ADD CONSTRAINT "_connectedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_connectedUsers" ADD CONSTRAINT "_connectedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
