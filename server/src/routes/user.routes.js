import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import { updateUserValidation } from "../validators/userValidator.js";
import { validate } from "../middleware/validate.js";
import {
  updateUser,
  deleteUser,
  restoreUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/update/:id",
  updateUserValidation,
  validate,
  verifyUser,
  updateUser
);
router.delete("/delete/:id", verifyUser, deleteUser);
router.post("/restore/:id", verifyUser, restoreUser);

export default router;
