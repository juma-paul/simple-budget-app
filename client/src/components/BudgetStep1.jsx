import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTotalBudget,
  setStep,
  setCurrency,
  setMonth,
  setYear,
} from "../redux/features/budget/budgetSlice.js";
import MaskedCurrencyInput from "./CurrencyInput.jsx";
import {
  DollarSign,
  Euro,
  PoundSterling,
  IndianRupee,
  JapaneseYen,
  AlertTriangle,
} from "lucide-react";
import { validateBudget } from "../utils/validateBudget.js";

const currencyIcons = {
  USD: DollarSign,
  EUR: Euro,
  GBP: PoundSterling,
  INR: IndianRupee,
  JPY: JapaneseYen,
};

const currencyOptions = ["USD", "EUR", "GBP", "JPY", "INR"];
const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const yearOptions = Array.from({ length: 10 }, (_, i) => `${2025 + i}`);

export default function BudgetStep1() {
  const dispatch = useDispatch();
  const { tempData, validation } = useSelector((state) => state.budget);
  const { errors } = validation;
  const [showErrors, setShowErrors] = useState(false);
  const errorTimeoutRef = useRef(null);

  const CurrencyIcon = currencyIcons[tempData.currency] || DollarSign;

  // Clear error timeout on unmount or new error
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleContinue = () => {
    setShowErrors(true);
    const validationResult = validateBudget(tempData);
    dispatch(setTotalBudget(tempData.totalBudget));
    if (validationResult.isValid) {
      dispatch(setStep(2));
      setShowErrors(false);
    } else {
      // Auto-clear errors after 4 seconds
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setShowErrors(false);
      }, 3000);
    }
  };

  const handleInputChange = (val) => {
    setShowErrors(false);
    dispatch(setTotalBudget(val || ""));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <CurrencyIcon className="mx-auto h-16 w-16 text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Set Your Monthly Budget
        </h2>
        <p className="text-gray-300">
          Enter the total amount you want to budget for this month
        </p>
      </div>

      {/* Currency Selector */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm text-white mb-1">Currency</label>
          <select
            value={tempData.currency}
            onChange={(e) => dispatch(setCurrency(e.target.value))}
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
          >
            {currencyOptions.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div className="flex-1">
          <label className="block text-sm text-white mb-1">Month</label>
          <select
            value={tempData.month}
            onChange={(e) => dispatch(setMonth(e.target.value))}
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selector */}
        <div className="flex-1">
          <label className="block text-sm text-white mb-1">Year</label>
          <select
            value={tempData.year}
            onChange={(e) => dispatch(setYear(e.target.value))}
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Currency Input */}
      <div className="relative">
        <MaskedCurrencyInput
          currency={tempData.currency}
          defaultValue={tempData.totalBudget}
          onChange={handleInputChange}
        />
      </div>

      {/* Error messages */}
      {showErrors && (
        <div className="space-y-2 transition-opacity duration-500 ease-out opacity-100">
          {errors.totalBudget && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 rounded-lg p-3">
              <AlertTriangle className="h-5 w-5" />
              <span>{errors.totalBudget}</span>
            </div>
          )}
          {errors.plannedAmount && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 rounded-lg p-3">
              <AlertTriangle className="h-5 w-5" />
              <span>{errors.plannedAmount}</span>
            </div>
          )}
        </div>
      )}

      {/* Continue button */}
      <button
        type="button"
        onClick={handleContinue}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors"
      >
        Continue to Categories
      </button>
    </div>
  );
}
