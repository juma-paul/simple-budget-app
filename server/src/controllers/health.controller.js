import mongoose from "mongoose";

const formatUpTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs}h ${mins}m ${secs}s`;
};

const authorizedHealthCheck = (req, res) => {
  const providedKey = req.headers["x-api-key"];
  const expectedKey = process.env.HEALTH_SECRET;

  if (!providedKey || providedKey !== expectedKey) {
    ``;
    console.error(
      `\x1b[31mUnauthorized readiness check attempt from ${
        req.ip ||
        req.connection.remoteAddress ||
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        "unknown"
      }\x1b[0m`
    );

    res.status(403).json({
      status: "forbidden",
      message: "Unauthorized access attempt logged.",
      timestamp: new Date().toLocaleString(),
    });
    return false;
  }
  return true;
};

// Health check
export const healthCheck = (req, res) => {
  if (!authorizedHealthCheck(req, res)) return;
  res.status(200).json({
    status: "healthy",
    description: "Server is healthy and running",
    timestamp: new Date().toLocaleString(),
    uptime: formatUpTime(process.uptime()),
  });
};

// Readiness check
export const readinessCheck = async (req, res) => {
  if (!authorizedHealthCheck(req, res)) return;

  const checks = {
    database: false,
  };

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    checks.database = true;

    const allReady = Object.values(checks).every(Boolean);

    res.status(allReady ? 200 : 500).json({
      status: allReady ? "ready" : "not ready",
      description: allReady
        ? "Server is ready and all systems are operational"
        : "Server is not ready - some dependency checks failed",
      checks,
      timestamp: new Date().toLocaleString(),
    });
  } catch (err) {
    res.status(500).json({
      status: "not ready",
      checks,
      description: "Database not ready",
      error: err.message,
      timestamp: new Date().toLocaleString(),
    });
  }
};
