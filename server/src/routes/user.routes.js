import express from "express";
import { verifyUser, restrictDeletedUsers } from "../middleware/verifyUser.js";
import { updateUserValidation } from "../validators/userValidator.js";
import { validate } from "../middleware/validate.js";
import {
  updateUser,
  deleteUser,
  restoreUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.put(
  "/update/:id",
  updateUserValidation,
  validate,
  verifyUser,
  restrictDeletedUsers,
  updateUser
);
router.delete("/delete/:id", verifyUser, restrictDeletedUsers, deleteUser);
router.post("/restore/:id", verifyUser, restoreUser);

export default router;
