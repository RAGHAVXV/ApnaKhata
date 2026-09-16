const mongoose = require("mongoose");

const repaymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    method: {
      type: String,
      enum: [
        "cash",
        "upi",
        "bank",
        "card",
        "other",
      ],
      default: "cash",
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  }
);

const moneyOwedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    person: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["given", "borrowed"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    method: {
      type: String,
      enum: [
        "cash",
        "upi",
        "bank",
        "card",
        "other",
      ],
      default: "cash",
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    repayments: {
      type: [repaymentSchema],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "pending",
        "partiallyPaid",
        "dueSoon",
        "overdue",
        "settled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MoneyOwed",
  moneyOwedSchema
);