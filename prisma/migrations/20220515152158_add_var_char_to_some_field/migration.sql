/*
  Warnings:

  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `fullName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `hashPassword` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `salt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "fullName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "hashPassword" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "salt" SET DATA TYPE VARCHAR(500);
