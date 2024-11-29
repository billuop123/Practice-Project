-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "AuctionItems" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMPTZ NOT NULL,
    "photo" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "AuctionStatus" NOT NULL,

    CONSTRAINT "AuctionItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuctionItems" ADD CONSTRAINT "AuctionItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
