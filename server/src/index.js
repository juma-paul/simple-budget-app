import "@dotenvx/dotenvx/config";
import express from "express";
import morgan from "morgan";
import path from "path";
import healthRoutes from "./routes/health.routes.js";

const __dirname = path.resolve();
const app = express();

// Middleware
app.use(express.json());
process.env.NODE_ENV === "production"
  ? app.use(morgan("combined"))
  : app.use(morgan("dev"));

// API routes
app.use("/api/sys", healthRoutes);

// Static files from client build (production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
