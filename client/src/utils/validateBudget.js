export const validateBudget = (budgetData) => {
  const errors = {};
  let isValid = true;

  // Validate total budget
  const totalBudgetNum = parseFloat(budgetData.totalBudget);
  if (isNaN(totalBudgetNum) || totalBudgetNum <= 0) {
    error.totalBudget = "Total budget must be greaterb than 0";
    isValid = false;
  }

  // Validate categories allocated sum
  const totalAllocated = budgetData.categories.reduce(
    (sum, cat) => sum + (parseFloat(cat.plannedAmount) || 0),
    0
  );

  if (totalAllocated > totalBudgetNum) {
    errors.plannedAmount = "Total planned amount cannot exceed total budget";
    isValid = false;
  }

  // Validate each category
  budgetData.categories.forEach((cat, index) => {
    if (!cat.name.trim()) {
      errors[`category_${index}_name`] = "Category name is required";
      isValid = false;
    }

    if (!cat.plannedAmount || parseFloat(cat.plannedAmount) <= 0) {
      errors[`category_${index}_name`] = "Amount must be greater than 0";
      isValid = false;
    }
  });

  return { isValid, errors };
};
