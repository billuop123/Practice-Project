"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const authController_1 = require("../Controller/authController");
const authMiddleware_1 = require("../Controller/authMiddleware");
const cloudinaryController_1 = require("../Controller/cloudinaryController");
const frontendController_1 = require("../Controller/frontendController");
const express_1 = __importDefault(require("express"));
exports.userRouter = (0, express_1.default)();
const upload = (0, cloudinaryController_1.cloudinarySetup)();
exports.userRouter.post("/signup", upload.single("file"), authController_1.Signup);
exports.userRouter.post("/login", authController_1.login);
exports.userRouter.post("/info", authMiddleware_1.authMiddleware, frontendController_1.info);
