import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import { createBudget } from "../controllers/budget.controller.js";
import { budgetValidation } from "../validators/budgetValidator.js";

const router = express.Router();

router.post(
  "/create/:id",
  budgetValidation,
  validate,
  verifyUser,
  createBudget
);

export default router;
