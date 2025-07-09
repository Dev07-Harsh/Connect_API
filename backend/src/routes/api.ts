import express from "express";
import {
  getAllAPIs, 
} from "../controllers/apiController";
import { logApiUsage } from "../middleware/logApiUsage";
import { searchAPIs, trendingAPI } from "../controllers/userController";

const router = express.Router();

// Public API endpoints
router.get("/all", getAllAPIs);
router.get("/trending", trendingAPI);
router.post('/search', searchAPIs);

export default router;
