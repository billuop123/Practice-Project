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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "my-app3" });
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield consumer.connect();
        yield consumer.subscribe({
            topic: "auction-events",
            fromBeginning: true,
        });
        yield consumer.run({
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                try {
                    if (message.value) {
                        const messageValue = message.value.toString(); // Convert Buffer to string
                        const { auctionId, price, userEmail } = JSON.parse(messageValue);
                        yield prisma.bids.create({
                            data: {
                                price,
                                userEmail,
                                auctionId,
                            },
                        });
                    }
                    else {
                        console.warn("Received a message with null value");
                    }
                }
                catch (error) {
                    console.error("Error processing message:", error);
                }
            }),
        });
    });
}
main();
