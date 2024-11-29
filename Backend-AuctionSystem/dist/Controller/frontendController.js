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
exports.allItems = exports.info = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const info = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield prisma.user.findFirst({
        where: {
            email,
        },
        select: {
            name: true,
            photo: true,
            id: true,
        },
    });
    return res.json({
        user,
    });
});
exports.info = info;
const allItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield prisma.auctionItems.findMany({
            orderBy: {
                deadline: "asc",
            },
            select: {
                id: true, // Select only the 'id' of the auction item
                name: true, // Select only the 'name' of the auction item
                startingPrice: true, // Select starting price
                deadline: true, // Select deadline
                status: true, // Select status
                photo: true, // Select photo
                user: {
                    // Select related user data with specific fields
                    select: {
                        id: true, // Select only the 'id' of the user
                        name: true, // Select only the 'name' of the user
                        email: true,
                        photo: true, // Select only the 'email' of the user
                    },
                },
            },
        });
        res.json({
            items,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.allItems = allItems;
