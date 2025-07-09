import express from "express";
import { registerValidation } from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";
import {
  signUp,
  logIn,
  refreshAccessToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", registerValidation, validate, signUp);
router.post("/login", logIn);
router.post("/refresh", refreshAccessToken);

export default router;
