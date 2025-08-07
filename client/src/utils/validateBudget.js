export const validateBudget = (budgetData, newCategory = null) => {
  const errors = {};
  let isValid = true;

  // Validate total budget
  const totalBudget = String(budgetData.totalBudget || "");
  const totalBudgetNum = parseFloat(totalBudget.replace(/,/g, ""));
  if (!totalBudget || isNaN(totalBudgetNum) || totalBudgetNum <= 0) {
    errors.totalBudget = "Total budget must be greater than 0";
    isValid = false;
  }

  // Validate categories allocated sum
  const totalAllocated = budgetData.categories.reduce(
    (sum, cat) => sum + parseFloat(cat.amount || 0),
    0
  );

  if (totalAllocated > totalBudgetNum && !isNaN(totalBudgetNum)) {
    errors.plannedAmount =
      "Total budget is less than allocated categories. Increase the budget or remove categories in Step 2.";
    isValid = false;
  }

  // Validate each category
  budgetData.categories.forEach((cat, index) => {
    if (!cat.name.trim()) {
      errors[`category_${index}_name`] = "Category name is required";
      isValid = false;
    } else if (!/[a-zA-Z]/.test(cat.name) || /^\d+$/.test(cat.name)) {
      errors[`category_${index}_name`] =
        "Category name must contain letters and cannot be purely numeric";
      isValid = false;
    }

    if (
      !cat.amount ||
      parseFloat(cat.amount) <= 0 ||
      isNaN(parseFloat(cat.amount))
    ) {
      errors[`category_${index}_amount`] =
        "Amount must be a valid number greater than 0";
      isValid = false;
    }
  });

  // Validate new category if provided
  if (newCategory) {
    if (!newCategory.name.trim()) {
      errors.category_new_name = "Category name is required";
      isValid = false;
    } else if (
      !/[a-zA-Z]/.test(newCategory.name) ||
      /^\d+$/.test(newCategory.name)
    ) {
      errors.category_new_name =
        "Category name must contain letters and cannot be purely numeric";
      isValid = false;
    }

    const newAmountNum = parseFloat(newCategory.amount || "");
    if (
      !newCategory.amount ||
      isNaN(newAmountNum) ||
      newAmountNum <= 0 ||
      !/^\d+(\.\d{1,2})?$/.test(newCategory.amount)
    ) {
      errors.category_new_amount =
        "Amount must be a valid number greater than 0";
      isValid = false;
    } else if (
      newAmountNum >
      (isFinite(totalBudgetNum - totalAllocated)
        ? totalBudgetNum - totalAllocated
        : Infinity)
    ) {
      errors.category_new_amount = "Amount cannot exceed remaining budget";
      isValid = false;
    }
  }

  return { isValid, errors };
};
