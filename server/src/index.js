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
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
