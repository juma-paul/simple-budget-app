import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { successResponse } from "../utils/successResponse.js";
import { errorHandler } from "../utils/errorHandler.js";

// Create a new user
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      acceptedTerms,
      acceptedPrivacy,
    });
    await newUser.save();
    return successResponse(res, 201, "User created successfully.");
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const message = `An account with this ${duplicateField} already exists. Try logging in or use a different ${duplicateField}.`;
      return next(errorHandler(400, message));
    }
    return next(errorHandler(500, "Failed to create user."));
  }
};

// Log in an existing user
export const logIn = async (req, res, next) => {
  const { identifier, password } = req.body;
  try {
    const normalizedIdentifier = identifier.toLowerCase();
    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
      ],
    });

    if (!user) {
      return next(errorHandler(404, "Invalid username or password."));
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid username or password."));
    }

    // Update last login Date
    await User.updateOne(
      { _id: user.id },
      { $set: { lastLoggedIn: new Date() } }
    );

    // create access and refresh tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user._doc;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(
      res,
      200,
      `Login successful. Welcome back ${user.username}!`,
      userData
    );
  } catch (error) {
    console.log("Login Error:", error);
    return next(
      errorHandler(500, "Something went wrong. Please try again later.")
    );
  }
};
