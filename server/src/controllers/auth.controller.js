import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { successResponse } from "../utils/successResponse.js";
import { errorHandler } from "../utils/errorHandler.js";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password, acceptedTerms, acceptedPrivacy } =
      req.body;
    if (!username || !email || !password) {
      return next(errorHandler(400, "All fields are required."));
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      return next(
        errorHandler(400, "You must accept terms and privacy policy.")
      );
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      acceptedTerms,
      acceptedPrivacy,
    });
    await newUser.save();
    return successResponse(res, 201, "User created successfully.");
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const message = `${
        duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)
      } already exists.`;
      return next(errorHandler(400, message));
    }
    return next(errorHandler(500, "Failed to create user."));
  }
};
