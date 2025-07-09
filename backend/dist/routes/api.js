"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiController_1 = require("../controllers/apiController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Public API endpoints
router.get("/all", apiController_1.getAllAPIs);
router.get("/trending", userController_1.trendingAPI);
router.post('/search', userController_1.searchAPIs);
exports.default = router;
