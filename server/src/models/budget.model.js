import mongoose from "mongoose";

const budgetCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  plannedAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  actualAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
});
