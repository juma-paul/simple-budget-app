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

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
    },
    plannedTotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    actualTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    categories: [budgetCategorySchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound index (one budget per user per Month/Year)
budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

// Pre-save middleware to calculate totals
budgetSchema.pre("save", function (next) {
  this.plannedTotal = this.categories.reduce(
    (sum, cat) => sum + cat.plannedAmount,
    0
  );
  this.actualTotal = this.categories.reduce(
    (sum, cat) => sum + cat.actualAmount,
    0
  );
  next();
});

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
