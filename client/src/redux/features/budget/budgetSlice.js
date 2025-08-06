import { createSlice, isPlainObject } from "@reduxjs/toolkit";
import { validateBudget } from "../../../utils/validateBudget.js";

const now = new Date();
const defaultMonth = now.toLocaleString("default", { month: "long" });
const defaultYear = now.getFullYear();

const initialState = {
  step: 1,
  tempData: {
    totalBudget: "",
    currency: "USD",
    month: defaultMonth,
    year: defaultYear.toString(),
    categories: [],
  },
  validation: {
    errors: {},
    isValid: true,
  },
  submitSuccess: false,
  submitError: null,
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },

    setTotalBudget: (state, action) => {
      state.tempData.totalBudget = action.payload;
      const formatted = parseFloat(action.payload);
      state.validation = validateBudget({
        ...state.tempData,
        totalBudget: isNaN(formatted) ? "" : formatted.toFixed(2),
      });
    },

    setCurrency: (state, action) => {
      state.tempData.currency = action.payload;
    },

    setMonth: (state, action) => {
      state.tempData.month = action.payload;
    },

    setYear: (state, action) => {
      state.tempData.year = action.payload;
    },

    addCategory: (state, action) => {
      const newCategory = {
        id: Date.now().toString(),
        ...action.payload,
        order: state.tempData.categories.length,
      };

      state.tempData.categories.push(newCategory);
      state.validation = validateBudget(state.tempData);
    },

    updateCategory: (state, action) => {
      const { id, updates } = action.payload;
      const category = state.tempData.categories.find((cat) => cat.id === id);

      if (category) {
        Object.assign(category, updates);
        state.validation = validateBudget(state.tempData);
      }
    },

    removeCategory: (state, action) => {
      state.tempData.categories = state.tempData.categories.filter(
        (cat) => cat.id !== action.payload
      );
      state.validation = validateBudget(state.tempData);
    },

    resetBudgetState: () => initialState,

    setSubmitSuccess: (state, action) => {
      state.submitSuccess = action.payload;
    },

    setSubmitError: (state, action) => {
      state.submitError = action.payload;
    },
  },
});

export const {
  setStep,
  setTotalBudget,
  setCurrency,
  setMonth,
  setYear,
  addCategory,
  updateCategory,
  removeCategory,
  resetBudgetState,
  setSubmitSuccess,
  setSubmitError,
} = budgetSlice.actions;

export default budgetSlice.reducer;
