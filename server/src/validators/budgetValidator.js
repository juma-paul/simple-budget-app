import { body, validationResult } from "express-validator";

export const budgetValidation = [
  body("totalBudget")
    .isFloat({ min: 0 })
    .withMessage("Total budget must be a positive number")
    .customSanitizer((value) => parseFloat(value)), // Convert to number

  body("month")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12")
    .customSanitizer((value) => parseInt(value, 10)), // Ensure integer

  body("year")
    .isInt({ min: 1900 })
    .withMessage("Year must be a valid 4-digit number")
    .custom((value) => {
      const currentYear = new Date().getFullYear();
      if (value > currentYear) {
        throw new Error(`Year cannot be in the future (max ${currentYear})`);
      }
      return true;
    })
    .customSanitizer((value) => parseInt(value, 10)), // Ensure integer

  body("categories")
    .isArray({ min: 0 })
    .withMessage("Categories must be an array"),

  body("categories.*.plannedAmount")
    .isFloat({ min: 0 })
    .withMessage("Category planned amount must be positive")
    .customSanitizer((value) => parseFloat(value)), // Convert to number

  body("categories.*.name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category name must be 1-50 characters"),

  body("categories.*.actualAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Category actual amount must be positive")
    .customSanitizer((value) => parseFloat(value) || 0), // Convert to number or 0

  body("categories.*.order")
    .isInt({ min: 0 })
    .withMessage("Category order must be a non-negative integer")
    .customSanitizer((value) => parseInt(value, 10)), // Ensure integer

  body("notes")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Notes must be under 500 characters"),
];
