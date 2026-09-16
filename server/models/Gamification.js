const mongoose = require("mongoose");

const gamificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Total points earned by the user
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Current active streak
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Highest streak ever achieved
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Number of successful months
    successfulMonths: {
      type: Number,
      default: 0,
    },

    // Number of failed months
    failedMonths: {
      type: Number,
      default: 0,
    },

    // Available streak shields
    streakShields: {
      type: Number,
      default: 0,
      min: 0,
    },

    // History of completed/broken streaks
    streakHistory: [
      {
        streakLength: {
          type: Number,
          required: true,
        },

        endedAt: {
          type: Date,
          default: Date.now,
        },

        reason: {
          type: String,
          default: "Streak broken",
        },
      },
    ],

    // Last month that was evaluated
    lastEvaluatedMonth: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Gamification",
  gamificationSchema
);