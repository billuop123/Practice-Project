import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "my-app3" });
const prisma = new PrismaClient();
async function main() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "auction-events",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (message.value) {
          const messageValue = message.value.toString(); // Convert Buffer to string
          const { auctionId, price, userEmail } = JSON.parse(messageValue);
          await prisma.bids.create({
            data: {
              price,
              userEmail,
              auctionId,
            },
          });
        } else {
          console.warn("Received a message with null value");
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
  });
}

main();
