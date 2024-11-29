import express from "express";
import { authMiddleware } from "../Controller/authMiddleware";
import { prisma } from "../PrismaClient";
import { Kafka } from "kafkajs";
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();
export const BidRouter = express();
BidRouter.use(express.json());

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
BidRouter.post("/bidDetails", async (req: any, res: any) => {
  const { id } = req.body;
  try {
    const bidDetails = await prisma.bids.findMany({
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
    const highestBid = bidDetails.reduce((acc: any, currentVal) => {
      return currentVal.price > acc.price ? currentVal : acc;
    });

    if (!highestBid) {
      // This check is to make sure highestBid has a valid value.
      return res.status(404).json({ message: "No valid highest bid found" });
    }

    const { userEmail, price } = highestBid;

    // Fetch the user information for the highest bidder
    const userInfo = await prisma.user.findFirst({
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
  } catch (error) {
    console.error("Error fetching bid details:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching bid details" });
  }
});
BidRouter.post("/produce-message", (req, res) => {
  const { auctionId, price, userEmail } = req.body;
  async function main() {
    await producer.connect();
    await producer.send({
      topic: "auction-events",
      messages: [
        {
          value: JSON.stringify({ auctionId, price, userEmail }),
        },
      ],
    });
  }
  main();
  res.json({
    message: "message sent",
  });
});
