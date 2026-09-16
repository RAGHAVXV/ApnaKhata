const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Example: car, home, education, travel, laptop, other
    goalType: {
      type: String,
      required: true,
      trim: true,
    },

    // Current estimated cost of the goal
    targetAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    // Amount already saved specifically for this goal
    currentSavings: {
      type: Number,
      default: 0,
      min: 0,
    },

    // User's preferred target date
    targetDate: {
      type: Date,
      default: null,
    },

    // Allows future price estimation, for example inflation
    expectedAnnualIncrease: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Optional connection to a budget
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SavingsGoal", savingsGoalSchema);