import express from "express";
import { signUp } from "../controllers/auth.controller.js";
import { registerValidation } from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/signup", registerValidation, validate, signUp);

export default router;
