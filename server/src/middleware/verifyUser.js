import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return next(errorHandler(401, "You are not authenticated!"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the full user document using the decoded id
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(errorHandler(401, "User not found."));
    }

    req.userId = user._id.toString();
    req.user = user;

    next();
  } catch (err) {
    return next(errorHandler(403, "Access denied. Please login again."));
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
}