import { useBudgetStore } from "../../store/budgetStore.js";
import CurrencyInputField from "../CurrencyInputField.jsx";
import Notification from "../Notification.jsx";

export default function Step1() {
  const tempData = useBudgetStore((s) => s.tempData);
  const setTotalBudget = useBudgetStore((s) => s.setTotalBudget);
  const setCurrency = useBudgetStore((s) => s.setCurrency);
  const setMonth = useBudgetStore((s) => s.setMonth);
  const setYear = useBudgetStore((s) => s.setYear);
  const setStep = useBudgetStore((s) => s.setStep);
  const validateCurrentStep = useBudgetStore((s) => s.validateCurrentStep);

  const months = [
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
  const years = Array.from({ length: 10 }, (_, i) => 2025 + i);

  const handleContinue = () => {
    if (validateCurrentStep()) {
      setStep(2);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Budget Information</h2>
        <p className="text-gray-400">Set up your basic budget details</p>
      </div>

      {/* Currency and Period Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Currency</label>
          <select
            value={tempData.currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Month</label>
          <select
            value={tempData.month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <select
            value={tempData.year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Total Budget Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Total Budget</label>
        <CurrencyInputField
          currency={tempData.currency}
          value={tempData.totalBudget}
          onChange={setTotalBudget}
        />
      </div>

      <Notification />

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2 mb-6">
        <div className="w-8 h-2 bg-blue-500 rounded"></div>
        <div className="w-8 h-2 bg-gray-600 rounded"></div>
        <div className="w-8 h-2 bg-gray-600 rounded"></div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
          onClick={handleContinue}
        >
          Continue to Categories
        </button>
      </div>
    </div>
  );
}
