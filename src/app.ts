import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/auth";
import gadgetRoutes from "./routes/gadgets";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

// Load environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-frontend-domain.com"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "operational",
    message: "IMF Gadget API is running smoothly",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/gadgets", gadgetRoutes);

// Welcome message for root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🕶️ Welcome to the IMF Gadget API",
    description:
      "Your mission, should you choose to accept it, is to manage the most advanced gadgets in the world.",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      gadgets: "/api/gadgets",
      health: "/health",
    },
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Received SIGINT. Graceful shutdown...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Received SIGTERM. Graceful shutdown...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 IMF Gadget API is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});

export default app;
