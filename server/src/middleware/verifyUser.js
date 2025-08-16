import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    const error = errorHandler(401, "You are not authenticated!");
    error.error = "token_expired";
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the full user document using the decoded id
    const user = await User.findById(decoded.id);

    if (!user) {
      const error = errorHandler(401, "User not found.");
      error.error = "token_expired";
      return next(error);
    }

    req.userId = user._id.toString();
    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const error = errorHandler(401, "Access token expired.");
      error.error = "token_expired";
      return next(error);
    }
    const error = errorHandler(403, "Access denied. Please login again.");
    return next(error);
  }
};

export const restrictDeletedUsers = (req, res, next) => {
  if (req.user && req.user.isDeleted) {
    return res.status(403).json({
      message:
        "Account is scheduled for deletion. Please restore your account to regain access.",
    });
  }
  next();
};
