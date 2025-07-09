import { validationResult } from "express-validator";
import { errorHandler } from "../utils/errorHandler";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errorHandler(400, errors.array()[0].msg));
  }
  next();
};
