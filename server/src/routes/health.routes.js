import express from "express";
import { healthCheck, readinessCheck } from "../controllers/health.controller.js";

const router = express.Router();

router.get("/healthz", healthCheck);
router.get("/readyz", readinessCheck);

export default router;