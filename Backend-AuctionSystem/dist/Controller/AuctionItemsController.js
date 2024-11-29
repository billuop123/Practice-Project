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
exports.itemInfo = exports.addItems = void 0;
const client_1 = require("@prisma/client");
const Prisma = new client_1.PrismaClient();
const addItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { name, description, createdAt, deadline, userId, status, startingPrice, } = req.body;
    const uploadedFile = req === null || req === void 0 ? void 0 : req.file;
    try {
        const newItem = yield Prisma.auctionItems.create({
            data: {
                name,
                description,
                createdAt,
                deadline,
                userId: Number(userId),
                status,
                photo: uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.path,
                startingPrice: Number(startingPrice),
            },
        });
        res.json({
            status: "success",
            newItem,
        });
    }
    catch (err) {
        res.json({
            status: "Failure",
        });
    }
});
exports.addItems = addItems;
const itemInfo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.body;
        try {
            const item = yield Prisma.auctionItems.findFirst({
                where: {
                    id, // Find the item by its unique ID
                },
                select: {
                    name: true,
                    description: true,
                    photo: true,
                    status: true,
                    startingPrice: true,
                    deadline: true,
                    user: {
                        select: {
                            name: true,
                            photo: true,
                            email: true,
                        },
                    },
                },
            });
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            res.json({ item });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Something went wrong" });
        }
    });
};
exports.itemInfo = itemInfo;
