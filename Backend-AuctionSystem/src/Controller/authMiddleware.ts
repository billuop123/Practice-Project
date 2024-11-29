import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
export const authMiddleware = function (req: any, res: any, next: any) {
  const token = req.headers.authorization;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload) {
      next();
    }
  } catch (err) {
    return res.json({
      message: "please,login to access",
    });
  }
};
