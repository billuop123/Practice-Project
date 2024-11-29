"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidRouter = void 0;
const express_1 = __importDefault(require("express"));
const PrismaClient_1 = require("../PrismaClient");
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});
const producer = kafka.producer();
exports.BidRouter = (0, express_1.default)();
exports.BidRouter.use(express_1.default.json());
// BidRouter.post(
//   "/addBids",
//   authMiddleware,
//   async (req: any, res: any) => {
//     const { price, userEmail, auctionId } = req.body;
//     const newBid = await prisma.bids.create({
//       data: {
//         price,
//         userEmail,
//         auctionId,
//       },
//     });
//     return res.json({
//       message: "New Bid created",
//       newBid,
//     });
//   }
// );
exports.BidRouter.post("/bidDetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const bidDetails = yield PrismaClient_1.prisma.bids.findMany({
            where: {
                auctionId: id,
            },
        });
        if (bidDetails.length === 0) {
            // If there are no bids, return an appropriate response
            return res
                .status(404)
                .json({ message: "No bids found for this auction" });
        }
        // Find the highest bid
        const highestBid = bidDetails.reduce((acc, currentVal) => {
            return currentVal.price > acc.price ? currentVal : acc;
        });
        if (!highestBid) {
            // This check is to make sure highestBid has a valid value.
            return res.status(404).json({ message: "No valid highest bid found" });
        }
        const { userEmail, price } = highestBid;
        // Fetch the user information for the highest bidder
        const userInfo = yield PrismaClient_1.prisma.user.findFirst({
            where: {
                email: userEmail,
            },
            select: {
                name: true,
                photo: true,
                email: true,
            },
        });
        if (!userInfo) {
            // If no user was found with the given email
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            userInfo,
            price,
        });
    }
    catch (error) {
        console.error("Error fetching bid details:", error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching bid details" });
    }
}));
exports.BidRouter.post("/produce-message", (req, res) => {
    const { auctionId, price, userEmail } = req.body;
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            yield producer.connect();
            yield producer.send({
                topic: "auction-events",
                messages: [
                    {
                        value: JSON.stringify({ auctionId, price, userEmail }),
                    },
                ],
            });
        });
    }
    main();
    res.json({
        message: "message sent",
    });
});
