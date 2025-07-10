import express from "express";
import {
  healthCheck,
  readinessCheck,
  testEmail,
} from "../controllers/health.controller.js";

const router = express.Router();

router.get("/healthz", healthCheck);
router.get("/readyz", readinessCheck);
router.get("/test-email", testEmail);

export default router;