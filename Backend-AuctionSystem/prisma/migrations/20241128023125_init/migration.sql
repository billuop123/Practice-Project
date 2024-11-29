/*
  Warnings:

  - Made the column `createdAt` on table `AuctionItems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deadline` on table `AuctionItems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photo` on table `AuctionItems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `AuctionItems` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `auctionId` to the `Bids` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuctionItems" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "deadline" SET NOT NULL,
ALTER COLUMN "photo" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "Bids" ADD COLUMN     "auctionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Bids" ADD CONSTRAINT "Bids_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "AuctionItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
