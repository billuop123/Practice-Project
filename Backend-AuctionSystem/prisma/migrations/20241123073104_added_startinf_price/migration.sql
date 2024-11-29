/*
  Warnings:

  - Added the required column `startingPrice` to the `AuctionItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuctionItems" ADD COLUMN     "startingPrice" INTEGER NOT NULL;
