import express from "express";
import { signUpValidation } from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";
import {
  signUp,
  logIn,
  google,
  logOut,
  refreshAccessToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUpValidation, validate, signUp);
router.post("/login", logIn);
router.post("/google", google);
router.post("/logout", logOut);
router.post("/refresh", refreshAccessToken);

export default router;
