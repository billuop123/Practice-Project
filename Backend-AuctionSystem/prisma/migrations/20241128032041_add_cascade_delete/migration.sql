/*
  Warnings:

  - You are about to drop the column `userId` on the `Bids` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Bids` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuctionItems" DROP CONSTRAINT "AuctionItems_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bids" DROP CONSTRAINT "Bids_auctionId_fkey";

-- DropForeignKey
ALTER TABLE "Bids" DROP CONSTRAINT "Bids_userId_fkey";

-- AlterTable
ALTER TABLE "AuctionItems" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deadline" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Bids" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AuctionItems" ADD CONSTRAINT "AuctionItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bids" ADD CONSTRAINT "Bids_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "AuctionItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bids" ADD CONSTRAINT "Bids_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
