import { body } from "express-validator";

export const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

  body("username")
    .trim()
    .isLength({ min: 4, max: 12 })
    .withMessage("Username must be between 4-12 characters")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters.")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must include at least one letter.")
    .matches(/[\d\W_]/)
    .withMessage("Password must include at least one number or symbol."),
];
