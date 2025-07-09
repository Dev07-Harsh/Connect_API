"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userMiddleware_1 = require("../middleware/userMiddleware"); // Ensure authentication
const router = express_1.default.Router();
// User Authentication Routes
router.post("/signup", userController_1.userSignup);
router.post("/login", userController_1.userLogin);
// API Search and Discovery
router.post("/search", userMiddleware_1.verifyUser, userController_1.searchAPIs);
router.get("/trending", userController_1.trendingAPI);
router.post("/try/:id", userMiddleware_1.verifyUser, userController_1.tryAPI);
// 📊 API Interaction Tracking
router.post("/track-interaction", userMiddleware_1.verifyUser, userController_1.trackApiInteraction);
// ⭐ Bookmark Management
router.post("/bookmark", userMiddleware_1.verifyUser, userController_1.toggleBookmark);
router.get("/bookmarks", userMiddleware_1.verifyUser, userController_1.getUserBookmarks);
// 📈 User Analytics
router.get("/interaction-history", userMiddleware_1.verifyUser, userController_1.getUserInteractionHistory);
exports.default = router;
