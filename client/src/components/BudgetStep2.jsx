import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addCategory,
  removeCategory,
  setStep,
} from "../redux/features/budget/budgetSlice.js";
import MaskedCurrencyInput from "./CurrencyInput.jsx";
import { validateBudget } from "../utils/validateBudget.js";
import { AlertTriangle } from "lucide-react";

const currencyLocales = {
  USD: { locale: "en-US", currency: "USD" },
  EUR: { locale: "de-DE", currency: "EUR" },
  GBP: { locale: "en-GB", currency: "GBP" },
  JPY: { locale: "ja-JP", currency: "JPY" },
  INR: { locale: "en-IN", currency: "INR" },
};

export default function BudgetStep2() {
  const dispatch = useDispatch();
  const { tempData, validation } = useSelector((state) => state.budget);
  const { categories, totalBudget, currency } = tempData;
  const { errors } = validation;
  const [showCategoryErrors, setShowCategoryErrors] = useState(false);
  const [showNextErrors, setShowNextErrors] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", amount: "" });
  const errorTimeoutRef = useRef(null);

  const totalAllocated = categories.reduce(
    (sum, cat) => sum + parseFloat(cat.amount || 0),
    0
  );
  const remainingBudget = parseFloat(totalBudget || 0) - totalAllocated;

  // Clear error timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const isValidAmount = (amount) =>
    amount !== "" &&
    !isNaN(parseFloat(amount)) &&
    parseFloat(amount) > 0 &&
    /^\d+(\.\d{1,2})?$/.test(amount);

  const isValidName = (name) =>
    name.trim() && /[a-zA-Z]/.test(name) && !/^\d+$/.test(name);

  const canAdd =
    isValidName(newCategory.name) &&
    isValidAmount(newCategory.amount) &&
    parseFloat(newCategory.amount) <=
      (isFinite(remainingBudget) ? remainingBudget : Infinity);

  const handleAdd = () => {
    setShowCategoryErrors(true);
    const validationResult = validateBudget(tempData, newCategory);
    if (
      validationResult.isValid &&
      !validationResult.errors.category_new_name &&
      !validationResult.errors.category_new_amount
    ) {
      dispatch(addCategory(newCategory));
      setNewCategory({ name: "", amount: "" });
      setShowCategoryErrors(false);
    } else {
      // Auto-clear errors after 4 seconds
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setShowCategoryErrors(false);
      }, 4000);
    }
  };

  const handleNext = () => {
    setShowNextErrors(true);
    const validationResult = validateBudget(tempData);
    if (validationResult.isValid && categories.length > 0) {
      dispatch(setStep(3));
      setShowNextErrors(false); // Clear errors on successful navigation
    } else {
      // Auto-clear errors after 4 seconds
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setShowNextErrors(false);
      }, 4000);
    }
  };

  const handleNameChange = (e) => {
    setShowCategoryErrors(false); // Clear errors on input change
    setNewCategory((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleAmountChange = (val) => {
    setShowCategoryErrors(false); // Clear errors on input change
    setNewCategory((prev) => ({ ...prev, amount: val || "" }));
  };

  const formatCurrency = (value) => {
    const { locale, currency: currCode } =
      currencyLocales[currency] || currencyLocales["USD"];
    const decimals = currCode === "JPY" ? 0 : 2;
    const number = parseFloat(value);
    return isNaN(number)
      ? new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currCode,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(0)
      : number.toLocaleString(locale, {
          style: "currency",
          currency: currCode,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Step 2: Allocate Categories</h2>

      {/* New category name input */}
      <input
        type="text"
        placeholder="Category name"
        value={newCategory.name}
        onChange={handleNameChange}
        className="w-full p-2 mb-2 rounded border bg-gray-800 text-white"
      />

      {/* New category name error */}
      {showCategoryErrors && errors.category_new_name && (
        <p className="text-red-600 mb-2 transition-opacity duration-500 ease-out opacity-100">
          {errors.category_new_name}
        </p>
      )}

      {/* Enter Amount */}
      <MaskedCurrencyInput
        currency={currency}
        defaultValue={newCategory.amount}
        onChange={handleAmountChange}
        placeholder={formatCurrency(remainingBudget)}
      />

      {/* New category amount error */}
      {showCategoryErrors && errors.category_new_amount && (
        <p className="text-red-600 mt-2 transition-opacity duration-500 ease-out opacity-100">
          {errors.category_new_amount}
        </p>
      )}

      {/* Remaining Budget Display */}
      <div className="mt-2 text-gray-300">
        Remaining Budget: {formatCurrency(remainingBudget)}
      </div>

      <button
        onClick={handleAdd}
        disabled={!canAdd}
        className={`mt-2 px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50`}
      >
        Add Category
      </button>

      {/* Category list */}
      <ul className="mt-6 space-y-2 max-h-48 overflow-auto">
        {categories.map((cat, index) => (
          <li
            key={cat.id}
            className="flex justify-between items-center border-b py-1"
          >
            <span>{cat.name}</span>
            <div>
              <span className="mr-4">{formatCurrency(cat.amount)}</span>
              <button
                onClick={() => dispatch(removeCategory(cat.id))}
                className="text-red-600 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            {showNextErrors && (
              <div className="text-red-600 mt-1 transition-opacity duration-500 ease-out opacity-100">
                {errors[`category_${index}_name`] && (
                  <p>{errors[`category_${index}_name`]}</p>
                )}
                {errors[`category_${index}_amount`] && (
                  <p>{errors[`category_${index}_amount`]}</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Planned amount error */}
      {showNextErrors && errors.plannedAmount && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 rounded-lg p-3 mt-2 transition-opacity duration-500 ease-out opacity-100">
          <AlertTriangle className="h-5 w-5" />
          <span>{errors.plannedAmount}</span>
        </div>
      )}

      <button
        onClick={() => dispatch(setStep(1))}
        className="mt-4 mr-2 px-4 py-2 rounded bg-gray-700"
      >
        Back
      </button>
      <button
        onClick={handleNext}
        className="mt-4 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
      >
        Next: Review & Confirm
      </button>
    </div>
  );
}
