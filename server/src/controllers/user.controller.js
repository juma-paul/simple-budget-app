import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/successResponse.js";

// Update user profile
export const updateUser = async (req, res, next) => {
  if (req.userId !== req.params.id) {
    return next(
      errorHandler(403, "You are not authorized to update this user.")
    );
  }

  try {
    const updateFields = {};
    const allowedFields = [
      "firstName",
      "lastName",
      "username",
      "email",
      "currentPassword",
      "newPassword",
      "confirmPassword",
      "profilePicture",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    // Check if any fields actually changed (excluding password logic)
    let hasChanges = false;
    for (const key in updateFields) {
      if (
        key !== "currentPassword" &&
        key !== "newPassword" &&
        key !== "confirmPassword" &&
        updateFields[key] !== user[key]
      ) {
        hasChanges = true;
        break;
      }
    }

    // Handle password change separately
    if (req.body.newPassword) {
      const validPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!validPassword) {
        return next(errorHandler(401, "Current password is incorrect."));
      }

      if (req.body.confirmPassword !== req.body.newPassword) {
        return next(errorHandler(400, "Passwords do not match."));
      }

      const hashed = await bcrypt.hash(req.body.newPassword, 10);
      updateFields.password = hashed;
      hasChanges = true;
    }

    if (!hasChanges) {
      return next(errorHandler(400, "No changes detected to update."));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    const { password: _, ...userData } = updatedUser._doc;

    return successResponse(res, 201, "User updated successfully.", userData);
  } catch (error) {
    return next(errorHandler(500, "Something went wrong while updating user."));
  }
};