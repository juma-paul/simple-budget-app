import { useState } from "react";
import { Trash2, Edit3, Plus, Check, X } from "lucide-react";
import { useBudgetStore } from "../../store/budgetStore.js";
import { useNotificationStore } from "../../store/notificationStore.js";
import CurrencyInputField from "../CurrencyInputField.jsx";
import Notification from "../Notification.jsx";
import getCurrencySymbol from "../../utils/getCurrencySymbol.js";

export default function Step2() {
  const tempData = useBudgetStore((s) => s.tempData);
  const addCategory = useBudgetStore((s) => s.addCategory);
  const removeCategory = useBudgetStore((s) => s.removeCategory);
  const updateCategory = useBudgetStore((s) => s.updateCategory);
  const setStep = useBudgetStore((s) => s.setStep);
  const validateCurrentStep = useBudgetStore((s) => s.validateCurrentStep);

  const setNotification = useNotificationStore((s) => s.setNotification);

  const [newCategory, setNewCategory] = useState({ name: "", amount: 0 });
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const totalAllocated = tempData.categories.reduce(
    (sum, c) => sum + (c.amount || 0),
    0
  );
  const remaining = tempData.totalBudget - totalAllocated;

  const handleAddCategory = () => {
    if (!newCategory.name?.trim()) {
      setNotification("error", "Category name is required");
      return;
    }
    if (!newCategory.amount || newCategory.amount <= 0) {
      setNotification("error", "Category amount must be greater than 0");
      return;
    }
    const nameExists = tempData.categories.find(
      (cat) =>
        cat.name.toLowerCase().trim() === newCategory.name.toLowerCase().trim()
    );
    if (nameExists) {
      setNotification("error", "A category with this name already exists");
      return;
    }
    if (totalAllocated + newCategory.amount > tempData.totalBudget) {
      setNotification(
        "error",
        "Adding this category would exceed your total budget"
      );
      return;
    }
    addCategory({
      ...newCategory,
      name: newCategory.name.trim(),
      amount: Number(newCategory.amount),
    });

    setNewCategory({ name: "", amount: 0 });
    setShowAddForm(false);
    setNotification("success", "Category added successfully");
  };

  const handleDeleteCategory = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      removeCategory(id);
      if (editingId === id) setEditingId(null);
      setNotification("success", "Category deleted successfully");
    }
  };

  const handleCategoryUpdate = (id, field, value) => {
    if (field === "name" && value.trim() === "") {
      setNotification("error", "Category name cannot be empty");
      return;
    }
    if (field === "amount" && value <= 0) {
      setNotification("error", "Category amount must be greater than 0");
      return;
    }
    const updates = {
      [field]: field === "name" ? value.trim() : Number(value),
    };
    updateCategory(id, updates);
  };

  const handleContinue = () => {
    if (validateCurrentStep()) setStep(3);
  };
  const handleBack = () => setStep(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Budget Categories</h2>
        <p className="text-gray-400">
          Allocate your budget across different categories
        </p>
      </div>

      {/* Budget Overview */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Budget Overview</span>
          <span className="text-sm text-gray-400">
            {tempData.month} {tempData.year}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-400">Total Budget</p>
            <CurrencyInputField
              currency={tempData.currency}
              value={tempData.totalBudget}
              readOnly
              className="text-lg font-bold text-blue-400"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400">Allocated</p>
            <CurrencyInputField
              currency={tempData.currency}
              value={totalAllocated}
              readOnly
              className="text-lg font-bold text-yellow-400"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400">Remaining</p>
            <CurrencyInputField
              currency={tempData.currency}
              value={remaining}
              readOnly
              className={`text-lg font-bold ${
                remaining < 0 ? "text-red-400" : "text-green-400"
              }`}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Budget Allocation</span>
            <span>
              {Math.min(
                100,
                Math.round((totalAllocated / tempData.totalBudget) * 100)
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                remaining < 0
                  ? "bg-red-500"
                  : remaining === 0
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (totalAllocated / tempData.totalBudget) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <Notification />

      {/* Add Category Form */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors group"
        >
          <div className="flex items-center justify-center space-x-2 text-gray-400 group-hover:text-blue-400">
            <Plus size={20} />
            <span>Add Budget Category</span>
          </div>
        </button>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg border border-blue-500">
          <h3 className="font-medium mb-3 flex items-center">
            <Plus size={16} className="mr-2" />
            Add New Category
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Category name (e.g., Groceries, Entertainment)"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory((p) => ({ ...p, name: e.target.value }))
              }
              maxLength={50}
            />

            <CurrencyInputField
              currency={tempData.currency}
              value={newCategory.amount}
              onChange={(val) => setNewCategory((p) => ({ ...p, amount: val }))}
              placeholder="Amount"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddCategory}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Check size={16} className="mr-1" />
              Add Category
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCategory({ name: "", amount: 0 });
              }}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <X size={16} className="mr-1" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {tempData.categories.map((category) => (
          <div
            key={category.id}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                {editingId === category.id ? (
                  <>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) =>
                        handleCategoryUpdate(
                          category.id,
                          "name",
                          e.target.value
                        )
                      }
                      className="w-full p-2 rounded bg-gray-900 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      maxLength={50}
                      autoFocus
                    />
                    <CurrencyInputField
                      currency={tempData.currency}
                      value={category.amount}
                      onChange={(val) =>
                        handleCategoryUpdate(category.id, "amount", val)
                      }
                      className="p-2"
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <h4 className="font-medium text-white">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {(
                            (category.amount / tempData.totalBudget) *
                            100
                          ).toFixed(1)}
                          % of budget
                        </p>
                      </div>
                    </div>
                    <div className="text-right md:text-left">
                      <CurrencyInputField
                        currency={tempData.currency}
                        value={category.amount}
                        readOnly
                        className="text-lg font-bold text-green-400"
                      />
                      <p className="text-sm text-gray-400">Allocated amount</p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-4">
                {editingId === category.id ? (
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Save changes"
                  >
                    <Check size={16} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingId(category.id)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit category"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteCategory(category.id, category.name)
                      }
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {tempData.categories.length === 0 && !showAddForm && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mx-auto mb-4 opacity-50">
              {getCurrencySymbol(tempData.currency)}
            </div>
            <p className="text-lg mb-2">No categories added yet</p>
            <p className="text-sm">
              Add your first budget category to get started
            </p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2 mb-6">
        <div className="w-8 h-2 bg-gray-600 rounded"></div>
        <div className="w-8 h-2 bg-blue-500 rounded"></div>
        <div className="w-8 h-2 bg-gray-600 rounded"></div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between sm:flex-row gap-4">
        <button
          onClick={handleBack}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 sm:px-6 sm:py-3 
             rounded-lg font-medium text-sm sm:text-base transition-colors"
        >
          Back
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed 
             px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors"
          onClick={handleContinue}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
