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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = __importDefault(require("./config/db")); // Import the DB connection function
const api_1 = __importDefault(require("./routes/api"));
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
// CORS configuration
const corsOptions = {
    origin: [
        "http://localhost:5173", // Vite default port
        "https://connect-api-onw5.vercel.app", // Deployed version
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Cache-Control",
        "X-File-Name"
    ],
    exposedHeaders: ["Authorization"]
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Routes
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        database: mongoose_1.default.connection.readyState === 1 ? "connected" : "disconnected"
    });
});
// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.use("/app/admin", admin_1.default);
app.use("/app/user", user_1.default);
app.use("/app/api", api_1.default);
// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        message: "Route not found",
        path: req.originalUrl,
        method: req.method
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
    });
});
// Start server only after DB connection
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)(); // Establish MongoDB connection
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    }
    catch (error) {
        console.error(" Server Startup Failed:", error);
        process.exit(1); // Exit process on failure
    }
});
startServer();
