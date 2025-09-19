import Budget from "../models/budget.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/successResponse.js";

// Create Budget
export const createBudget = async (req, res, next) => {
  if (req.userId !== req.params.id) {
    return next(errorHandler(403, "You are not authorized to create a budget!"));
  }

  try {
    const { totalBudget, currency, month, year, categories = [], notes } = req.body;

    // Validate required fields
    if (totalBudget === undefined || month === undefined || year === undefined) {
      return next(errorHandler(400, "Missing required fields: totalBudget, month, or year"));
    }

    if (isNaN(totalBudget) || totalBudget <= 0) {
      return next(errorHandler(400, "Total budget must be a positive number"));
    }

    // Validate categories
    const validatedCategories = categories.map((cat, index) => {
      if (!cat.name || cat.name.trim() === "") {
        throw new Error(`Category at index ${index} has an invalid or empty name`);
      }
      if (isNaN(cat.plannedAmount) || cat.plannedAmount < 0) {
        throw new Error(`Category at index ${index} has an invalid planned amount`);
      }
      return {
        name: cat.name.trim(),
        plannedAmount: cat.plannedAmount,
        actualAmount: cat.actualAmount || 0,
      };
    });

    // Check existing budget
    const existingBudget = await Budget.findOne({
      userId: req.userId,
      month,
      year,
    });
    if (existingBudget) {
      return next(errorHandler(400, `Budget for ${month}/${year} already exists`));
    }

    // Create budget
    const budget = new Budget({
      userId: req.userId,
      plannedTotal: totalBudget,
      actualTotal: 0,
      currency: currency || "USD",
      month,
      year,
      notes,
      categories: validatedCategories,
    });

    await budget.save();
    return successResponse(res, 201, "Budget created successfully", budget);
  } catch (error) {
    return next(errorHandler(400, error.message || "Failed to create budget"));
  }
};
