import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import WebSocket, { WebSocketServer } from "ws";
import { userRouter } from "./Router/userRouter";
import { AuctionItemRouter } from "./Router/AuctionItemRouter";
import { BidRouter } from "./Router/BidRouter";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));

// Route configuration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionItem", AuctionItemRouter);
app.use("/api/v1/bids", BidRouter);

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// WebSocket server configuration
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data, isBinary) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
