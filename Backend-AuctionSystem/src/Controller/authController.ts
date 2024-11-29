import { PrismaClient } from "@prisma/client";
import z from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
const userSchema = z.object({
  name: z.string(),
  password: z.string().min(6), // Use `min` for minimum length
  email: z.string().email(), // Ensure email is a string and a valid email
});
const prisma = new PrismaClient();
export const Signup = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;
    const validationResult = userSchema.safeParse({ name, password, email });
    // Check for existing email
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    const token = jwt.sign({ email }, JWT_SECRET, {
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

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        photo: uploadedFile?.path, // Save Cloudinary URL
      },
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: { email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({
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
  const token = jwt.sign({ email }, "jwtsecret", {
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
};
