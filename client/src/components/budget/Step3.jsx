import React, { useState } from "react";
import { CheckCircle, AlertCircle, Edit3, ArrowLeft, Send } from "lucide-react";
import { useBudgetStore } from "../../store/budgetStore.js";
import { useMutation } from "@tanstack/react-query";
import { createBudgetApi } from "../../api/budgetApi.js";
import { useAuthStore } from "../../store/authStore.js";
import { useNotificationStore } from "../../store/notificationStore.js";
import Loading from "../Loading.jsx";
import CurrencyInputField from "../CurrencyInputField.jsx";
import Notification from "../Notification.jsx";

export default function Step3() {
  const tempData = useBudgetStore((s) => s.tempData);
  const setStep = useBudgetStore((s) => s.setStep);
  const resetBudget = useBudgetStore((s) => s.resetBudget);
  const setNotes = useBudgetStore((s) => s.setNotes);

  const user = useAuthStore((s) => s.user);
  const setNotification = useNotificationStore((s) => s.setNotification);
  const clearNotification = useNotificationStore((s) => s.clearNotification);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAllocated = tempData.categories.reduce(
    (sum, c) => sum + (c.amount || 0),
    0
  );
  const remaining = tempData.totalBudget - totalAllocated;
  const allocationPercentage =
    tempData.totalBudget > 0
      ? (totalAllocated / tempData.totalBudget) * 100
      : 0;

  const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const prepareBudgetData = () => ({
    totalBudget: tempData.totalBudget,
    currency: tempData.currency,
    month: monthMap[tempData.month] || 0,
    year: tempData.year,
    notes: tempData.notes,
    categories: tempData.categories.map((cat, i) => ({
      name: cat.name,
      plannedAmount: cat.amount,
      actualAmount: 0,
      order: i,
    })),
  });

  const { mutate: createBudget } = useMutation({
    mutationFn: (budgetData) => createBudgetApi(budgetData, user._id),
    onSuccess: (data) => {
      setNotification(
        "success",
        data.message || "Budget created successfully!"
      );
      setTimeout(() => {
        resetBudget();
        clearNotification();
      }, 3000);
    },
    onError: (err) => {
      setNotification("error", err.message || "Failed to create budget");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    const budgetData = prepareBudgetData();
    createBudget(budgetData);
  };

  const handleBack = () => setStep(2);
  const handleNotesChange = (e) => setNotes(e.target.value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review & Confirm</h2>
        <p className="text-gray-400">
          Review your budget details before submitting
        </p>
      </div>

      {/* Budget Summary Card */}
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <CheckCircle className="mr-3 text-green-400" size={24} />
            Budget Summary
          </h3>
          <button
            onClick={() => setStep(1)}
            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/20 transition-colors"
            title="Edit budget details"
          >
            <Edit3 size={18} />
          </button>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Period</p>
            <p className="font-bold text-white">
              {tempData.month} {tempData.year}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Total Budget</p>
            <CurrencyInputField
              currency={tempData.currency}
              value={tempData.totalBudget}
              readOnly
              className="font-bold text-blue-400"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Allocated</p>
            <CurrencyInputField
              currency={tempData.currency}
              value={totalAllocated}
              readOnly
              className="font-bold text-yellow-400"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Remaining</p>
            <CurrencyInputField
              currency={tempData.currency}
              value={remaining}
              readOnly
              className={`font-bold ${
                remaining < 0
                  ? "text-red-400"
                  : remaining === 0
                  ? "text-green-400"
                  : "text-white"
              }`}
            />
          </div>
        </div>

        {/* Allocation Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Budget Allocation</span>
            <span>{allocationPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                remaining < 0
                  ? "bg-red-500"
                  : remaining === 0
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-blue-500 to-purple-500"
              }`}
              style={{ width: `${Math.min(100, allocationPercentage)}%` }}
            ></div>
          </div>
        </div>

        {/* Status Messages */}
        {remaining < 0 && (
          <div className="flex items-center p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <AlertCircle className="text-red-400 mr-3" size={20} />
            <CurrencyInputField
              currency={tempData.currency}
              value={Math.abs(remaining)}
              readOnly
              className="text-red-400 text-sm"
            />
            <span className="text-red-400 text-sm ml-1">exceeded budget</span>
          </div>
        )}

        {remaining === 0 && (
          <div className="flex items-center p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
            <CheckCircle className="text-green-400 mr-3" size={20} />
            <p className="text-green-400 text-sm">
              Perfect! You have allocated your entire budget.
            </p>
          </div>
        )}

        {remaining > 0 && (
          <div className="flex items-center p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
            <AlertCircle className="text-blue-400 mr-3" size={20} />
            <CurrencyInputField
              currency={tempData.currency}
              value={remaining}
              readOnly
              className="text-blue-400 text-sm"
            />
            <span className="text-blue-400 text-sm ml-1">
              remaining to allocate
            </span>
          </div>
        )}
      </div>

      {/* Categories Breakdown */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Category Breakdown</h3>
          <button
            onClick={() => setStep(2)}
            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/20 transition-colors"
            title="Edit categories"
          >
            <Edit3 size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {tempData.categories.map((category, index) => {
            const categoryPercentage =
              (category.amount / tempData.totalBudget) * 100;
            const colors = [
              "bg-blue-500",
              "bg-green-500",
              "bg-yellow-500",
              "bg-purple-500",
              "bg-pink-500",
              "bg-indigo-500",
              "bg-red-500",
              "bg-teal-500",
            ];
            const colorClass = colors[index % colors.length];

            return (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
              >
                <div className="flex items-center flex-1">
                  <div
                    className={`w-4 h-4 rounded-full ${colorClass} mr-3`}
                  ></div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{category.name}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>{categoryPercentage.toFixed(1)}% of budget</span>
                      <span className="mx-2">•</span>
                      <CurrencyInputField
                        currency={tempData.currency}
                        value={category.amount}
                        readOnly
                        className="text-green-400 font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-24 bg-gray-700 rounded-full h-2 ml-4">
                  <div
                    className={`h-2 rounded-full ${colorClass} transition-all duration-300`}
                    style={{ width: `${categoryPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">
              Total Categories: {tempData.categories.length}
            </span>
            <CurrencyInputField
              currency={tempData.currency}
              value={totalAllocated}
              readOnly
              className="font-bold text-green-400"
            />
          </div>
        </div>
      </div>

      <Notification />

      {/* Notes Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <label className="block text-lg font-bold mb-3">Notes (Optional)</label>
        <textarea
          value={tempData.notes}
          onChange={handleNotesChange}
          placeholder="Add any additional notes about your budget, goals, or reminders..."
          className="w-full p-4 rounded-lg bg-gray-900 border border-gray-600 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 resize-none"
          rows={4}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-400">
            Add notes about your budget goals, spending priorities, or any
            reminders
          </p>
          <p className="text-xs text-gray-400">{tempData.notes.length}/500</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2 mb-6">
        <div className="w-8 h-2 bg-gray-600 rounded"></div>
        <div className="w-8 h-2 bg-gray-600 rounded"></div>
        <div className="w-8 h-2 bg-blue-500 rounded"></div>
      </div>

      {/* Navigation */}
      <div className="flex sm:flex-row justify-between items-center gap-4">
        <button
          onClick={handleBack}
          className="flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 sm:px-6 sm:py-3 
             rounded-lg font-medium text-sm sm:text-base transition-colors"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span>Back to Categories</span>
        </button>

        <div className="flex space-x-3">
          <button
            onClick={resetBudget}
            className="bg-red-600 hover:bg-red-700 px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg 
             font-medium text-sm sm:text-base transition-colors"
            disabled={isSubmitting}
          >
            Reset Budget
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed 
             px-4 py-1.5 sm:px-8 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors"
            disabled={isSubmitting || tempData.categories.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loading color="white" size={18} />
                <span className="ml-2">Creating Budget...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Create Budget
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
