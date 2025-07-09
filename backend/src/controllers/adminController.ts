import { Request, Response } from "express";
import Admin from "../models/Admin";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const adminSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

// ✅ Admin Signup
// ✅ Admin Signup with JWT Token
export const adminSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = adminSchema.parse(req.body);

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      res.status(400).json({ message: "Admin already exists" });
      return;
    }

    // Create new admin
    const newAdmin = await Admin.create({ name, email, password });
    
    // Generate JWT Token
    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email, role: newAdmin.role , name: newAdmin.name },
      process.env.JWT_SECRET as string);

    res.status(201).json({ message: "Admin registered successfully", token });
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error: (error as Error).message });
  }
};

// ✅ Admin Login
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: "admin", name : admin.name }, process.env.JWT_SECRET as string);

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error });
  }
};
