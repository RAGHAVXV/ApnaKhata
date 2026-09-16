const mongoose = require("mongoose");

const recurringTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    frequency: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    nextDueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "upcoming",
        "due",
        "overdue",
        "completed",
        "skipped",
      ],
      default: "upcoming",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastCompletedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "RecurringTransaction",
  recurringTransactionSchema
);