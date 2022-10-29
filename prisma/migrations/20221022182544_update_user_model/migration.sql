-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "hashPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "refreshToken" TEXT,
    "profileImageId" BIGINT,
    "coverImageId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" BIGINT NOT NULL,
    "code" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Image_id_key" ON "Image"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
