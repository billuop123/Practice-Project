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
exports.login = exports.Signup = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const userSchema = zod_1.default.object({
    name: zod_1.default.string(),
    password: zod_1.default.string().min(6), // Use `min` for minimum length
    email: zod_1.default.string().email(), // Ensure email is a string and a valid email
});
const prisma = new client_1.PrismaClient();
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const validationResult = userSchema.safeParse({ name, password, email });
        // Check for existing email
        const existingUser = yield prisma.user.findFirst({
            where: { email },
        });
        const token = jsonwebtoken_1.default.sign({ email }, config_1.JWT_SECRET, {
            expiresIn: 5 * 24 * 60 * 60 * 1000,
        });
        res.cookie("jwt", token, {
            httpOnly: true, // Prevent access via JavaScript
            secure: true, // Use HTTPS
            sameSite: "strict", // Protect against CSRF
            maxAge: 5 * 24 * 60 * 60 * 1000, // Expire in 5 days
        });
        if (!validationResult.success)
            return res.status(400).json({
                message: "Inputs are not in the required format",
            });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const uploadedFile = req.file;
        const newUser = yield prisma.user.create({
            data: {
                name,
                email,
                password,
                photo: uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.path, // Save Cloudinary URL
            },
        });
        res.status(201).json({
            status: "success",
            message: "User created successfully",
            user: { email },
            token,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred" });
    }
});
exports.Signup = Signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findFirst({
        where: {
            email,
            password,
        },
    });
    if (!user) {
        return res.status(400).json({
            message: "Email and Password donot match",
        });
    }
    const token = jsonwebtoken_1.default.sign({ email }, "jwtsecret", {
        expiresIn: 5 * 24 * 60 * 60 * 1000,
    });
    res.cookie("jwt", token, {
        httpOnly: true, // Prevent access via JavaScript
        secure: true, // Use HTTPS
        sameSite: "strict", // Protect against CSRF
        maxAge: 5 * 24 * 60 * 60 * 1000, // Expire in 5 days
    });
    return res.status(200).json({
        message: "Successfully logged in",
        email,
        token,
    });
});
exports.login = login;
