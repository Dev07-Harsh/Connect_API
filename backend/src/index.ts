import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db"; // Import the DB connection function
import apiRoutes from "./routes/api";
import adminRoutes from "./routes/admin";
import userRoutes from "./routes/user";
dotenv.config();

const app = express();
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

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Routes

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/app/admin", adminRoutes);
app.use("/app/user", userRoutes);
app.use("/app/api", apiRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Global error handler:", err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});

// Start server only after DB connection
const startServer = async () => {
  try {
    await connectDB(); // Establish MongoDB connection
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error(" Server Startup Failed:", error);
    process.exit(1); // Exit process on failure
  }
};

startServer();
