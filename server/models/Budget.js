const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // overall budget or category-specific budget
    scope: {
      type: String,
      enum: ["overall", "category"],
      required: true,
    },

    // Only used when scope is "category"
    category: {
      type: String,
      trim: true,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    period: {
      type: String,
      enum: ["weekly", "monthly", "custom"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    warningThreshold: {
      type: Number,
      default: 80,
      min: 1,
      max: 100,
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

module.exports = mongoose.model("Budget", budgetSchema);