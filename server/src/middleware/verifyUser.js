import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return next(errorHandler(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return next(errorHandler(403, "Access denied. Please login again."));
    req.userId = decoded.id;
    next();
  });
};