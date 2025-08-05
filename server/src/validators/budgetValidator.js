import { body } from "express-validator";

export const budgetValidation = [
  body("totalBudget")
    .isFloat({ min: 0 })
    .withMessage("Total budget must be a positive number"),

  body("month")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),

  body("year")
    .isInt({ min: 1900 })
    .withMessage("Year must be a valid 4-digit number")
    .custom((value) => {
      const currentYear = new Date().getFullYear();
      if (value > currentYear) {
        throw new Error(`Year cannot be in the future (max ${currentYear})`);
      }
      return true;
    }),

  body("categories").isArray().withMessage("Categories must be an array"),

  body("categories.*.plannedAmount")
    .isFloat({ min: 0 })
    .withMessage("Category amount must be positive"),

  body("categories.*.name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category name must be 1-50 characters"),

  body("notes")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Notes must be under 500 characters"),
];
