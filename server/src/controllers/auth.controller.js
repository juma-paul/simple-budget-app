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

// Generate a refresh token
export const refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(errorHandler(401, "Refresh token missing!"));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    return successResponse(res, 201, "Access token refreshed.");
  } catch (error) {
    return next(errorHandler(403, "Invalid refresh token"));
  }
};

// Create and login user using OAuth with google(gmail)
export const google = async (req, res, next) => {
  const { name, email, photo } = req.body;
  try {
    const user = await User.findOne({ email: email });

    // Check if there is already a user with this email
    if (user) {
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
    } else {
      // If there is no user with this email
      // 1. Randomly generate a password for user and hash it
      const randomAssignedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      randomAssignedPassword,
      saltRounds
    );

    // 2. Take their first name and concatenat random digits for uniqueness
    const base = name.split(" ")[0].toLowerCase();
    const suffix = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    const username = `${base}${suffix}`;

    // 3. Create and save new user and generate access and refresh tokens for user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      profilePicture: photo,
    });
    await newUser.save();

    const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = newUser._doc;

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

    return successResponse(res, 201, "User created successfully.", userData);
  } catch (error) {
    console.error("User creation error:", error);

    return next(
      errorHandler(500, "Something went wrong while creating the user.")
    );
  }
};

// Logout a user
export const logOut = (req, res) => {
  const cookieOptions = { httpOnly: true, sameSite: "strict", secure: true };
  const tokens = ["accessToken", "refreshToken"];

  tokens.forEach((element) => {
    res.clearCookie(element, cookieOptions);
  });

  return successResponse(res, 200, "You've been logged out successfully.");
};
