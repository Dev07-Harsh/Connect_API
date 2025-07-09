"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ✅ Middleware to verify admin authentication
const verifyAdmin = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access Denied. No token provided." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            res.status(403).json({ message: "Forbidden. You do not have admin access." });
            return;
        }
        req.admin = decoded; // Store admin data in request object
        next(); // Proceed to next middleware or route handler
    }
    catch (error) {
        res.status(400).json({ message: "Invalid admin" });
    }
};
exports.verifyAdmin = verifyAdmin;
