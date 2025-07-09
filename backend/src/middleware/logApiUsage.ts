import { Request, Response, NextFunction } from "express";
import Api from "../models/Api"; // Import API model

export const logApiUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Extract API ID from request

    const api = await Api.findById(id);
    if (api) {
      api.usageCount = (api.usageCount || 0) + 1; // Increment usage count
      await api.save();
    }

    next(); // Continue to the next middleware or controller
  } catch (error) {
    console.error("Error logging API usage:", error);
    next(); // Don't block request even if logging fails
  }
};
