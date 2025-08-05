import Budget from "../models/budget.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/successResponse.js";

export const createBudget = async (req, res, next) => {
  if (req.userId !== req.params.id) {
    return next(
      errorHandler(403, "You are not authorized to create a budget!")
    );
  }

  try {
    const { totalBudget, month, year, categories = [], notes } = req.body;

    if (!totalBudget || !month || !year) {
      return next(errorHandler(400, "Missing required fields!"));
    }

    if (!Array.isArray(categories)) {
      console.log("Categories should be an array");
    }

    // Sum of allocated amounts must not exceed totalBudget
    const totalAllocated = categories.reduce(
      (sum, cat) => sum + cat.plannedAmount,
      0
    );

    if (totalAllocated > totalBudget) {
      return next(errorHandler(400, "Allocated amounts exceed total budget."));
    }

    // Check for existing budget for user/month/year
    const existingBudget = await Budget.findOne({
      userId: req.userId,
      month,
      year,
    });

    if (existingBudget) {
      return next(
        errorHandler(400, `Budget for ${month}/${year} already exists`)
      );
    }

    // Create Budget - map categories with order index
    const budget = new Budget({
      userId: req.userId,
      totalBudget,
      month,
      year,
      notes,
      categories: categories.map((cat, index) => ({
        name: cat.name,
        plannedAmount: cat.plannedAmount ?? 0,
        actualAmount: cat.actualAmount ?? 0,
        order: index,
      })),
    });

    await budget.save();

    return successResponse(res, 201, "Budget created successfully", budget);
  } catch (error) {
    console.error(error);
    return next(errorHandler(500, "Failed to create budget!"));
  }
};
