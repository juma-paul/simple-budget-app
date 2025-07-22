import { body } from "express-validator";

export const updateUserValidation = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

  body("username")
    .optional()
    .trim()
    .isLength({ min: 2, max: 12 })
    .withMessage("Username must be between 2-12 characters.")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username may include letters, numbers, underscores, or dashes."
    ),

  body("firstName").optional().trim(),
  body("lasttName").optional().trim(),

  body("newPassword")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters.")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must include at least one letter")
    .matches(/[\d\W_]/)
    .withMessage("Password must include atleast one number or symbol."),

  body("confirmPassword")
    .optional()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
];
