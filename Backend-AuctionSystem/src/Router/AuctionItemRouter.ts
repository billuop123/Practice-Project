import express from "express";
import { addItems, itemInfo } from "../Controller/AuctionItemsController";
import { cloudinarySetup } from "../Controller/cloudinaryController";
import { allItems } from "../Controller/frontendController";
import { authMiddleware } from "../Controller/authMiddleware";
export const AuctionItemRouter = express();
AuctionItemRouter.use(express.json());
const upload = cloudinarySetup();
AuctionItemRouter.post(
  "/addItems",

  upload.single("photo"),
  authMiddleware,
  addItems
);
AuctionItemRouter.get("/allitems", authMiddleware, allItems);
AuctionItemRouter.post("/iteminfo", authMiddleware, itemInfo);
