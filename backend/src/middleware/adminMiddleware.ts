import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ✅ Define a Custom Request Type
export interface AuthRequest extends Request {
  admin?: { id: string; role: string }; // Extend Request with admin property
}

// ✅ Middleware to verify admin authentication
export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access Denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string , name: string };

    if (decoded.role !== "admin") {
      res.status(403).json({ message: "Forbidden. You do not have admin access." });
      return;
    }

    req.admin = decoded; // Store admin data in request object
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid admin" });
  }
};
