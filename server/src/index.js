import "@dotenvx/dotenvx/config";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import budgetRoutes from "./routes/budget.routes.js";

// Register background tasks
import "./tasks/deleteExpiredUsers.js";
import "./tasks/accountReminder.js";

const __dirname = path.resolve();
const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// API routes
app.use("/api/sys", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/budget", budgetRoutes);

// Static files from client build (production)
if (process.env.NODE_ENV === "production") {
  // Serve static assets
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // SPA fallback for all non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({
        error:
          "404 — This page doesn't exist or you don't have permission to view it.",
      });
    }

    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// Global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data: {},
  });
});

const port = process.env.PORT || 6798;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
