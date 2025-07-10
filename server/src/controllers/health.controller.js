import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail.js";

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
    console.error(
      `\x1b[31mUnauthorized readiness check attempt from ${req.ip}\x1b[0m`
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

// Test email
export const testEmail = async (req, res, next) => {
  if (!authorizedHealthCheck(req, res)) return;
  try {
    await sendEmail({
      to: "jpaul@lincolnucasf.edu",
      subject: "Account Deletion Notice",
      text: `Hi, Juma, your account will be permanently deleted in 3 days. If this was a mistake, please log in to restore it.`,
    });
    return res
      .status(200)
      .json({ message: "Test email sent to jpaul@lincolnucasf.edu" });
  } catch (error) {
    return next(errorHandler(500, "Email failed to send."));
  }
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
