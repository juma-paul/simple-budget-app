import "@dotenvx/dotenvx/config";
import express from "express";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes.js";

const app = express();
app.set("trust proxy", true);

// Middleware
app.use(express.json());
process.env.NODE_ENV === "production"
  ? app.use(morgan("combined"))
  : app.use(morgan("dev"));

// API routes
app.use("/api", healthRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
