"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionItemRouter = void 0;
const express_1 = __importDefault(require("express"));
const AuctionItemsController_1 = require("./Controller/AuctionItemsController");
const cloudinaryController_1 = require("./Controller/cloudinaryController");
const frontendController_1 = require("./Controller/frontendController");
exports.AuctionItemRouter = (0, express_1.default)();
exports.AuctionItemRouter.use(express_1.default.json());
const upload = (0, cloudinaryController_1.cloudinarySetup)();
exports.AuctionItemRouter.post("/addItems", upload.single("photo"), AuctionItemsController_1.addItems);
exports.AuctionItemRouter.get("/allitems", frontendController_1.allItems);
exports.AuctionItemRouter.post("/iteminfo", AuctionItemsController_1.itemInfo);
