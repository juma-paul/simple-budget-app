import "@dotenvx/dotenvx/config";
import express from "express";
import healthRoutes from "./routes/health.routes.js";

const app = express();
app.set("trust proxy", true);

// Middleware
app.use(express.json())

// API routes
app.use("/api", healthRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
