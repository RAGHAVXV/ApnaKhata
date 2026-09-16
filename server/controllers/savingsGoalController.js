const SavingsGoal = require("../models/SavingsGoal");
const Transaction = require("../models/Transaction");
const {
  getGoalInsight,
} = require("../utils/insightMessages");

// Create a savings goal
const createSavingsGoal = async (req, res) => {
  try {
    const {
      name,
      goalType,
      targetAmount,
      currentSavings,
      targetDate,
      expectedAnnualIncrease,
      budget,
    } = req.body;

    if (!name || !goalType || !targetAmount) {
      return res.status(400).json({
        message: "Name, goal type and target amount are required",
      });
    }

    if (Number(targetAmount) <= 0) {
      return res.status(400).json({
        message: "Target amount must be greater than zero",
      });
    }

    if (
      currentSavings !== undefined &&
      Number(currentSavings) < 0
    ) {
      return res.status(400).json({
        message: "Current savings cannot be negative",
      });
    }

    const savingsGoal = await SavingsGoal.create({
      name,
      goalType,
      targetAmount: Number(targetAmount),
      currentSavings: Number(currentSavings) || 0,
      targetDate: targetDate || null,
      expectedAnnualIncrease:
        Number(expectedAnnualIncrease) || 0,
      budget: budget || null,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Savings goal created successfully",
      savingsGoal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create savings goal",
      error: error.message,
    });
  }
};

// Get savings goals with live financial calculations
const getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    // Get all transactions once
    const transactions = await Transaction.find({
      user: req.user.id,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "expense") {
        totalExpense += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    const goalData = goals.map((goal) => {
      const progressPercentage =
        goal.targetAmount > 0
          ? Number(
              (
                (goal.currentSavings / goal.targetAmount) *
                100
              ).toFixed(2)
            )
          : 0;

      const remainingAmount = Math.max(
        goal.targetAmount - goal.currentSavings,
        0
      );

      let estimatedCompletionDate = null;
      let estimatedMonthsRemaining = null;

      /*
        We estimate monthly saving capacity from the
        user's financial activity.
      */
      if (balance > 0) {
        const transactionDates = transactions.map(
          (transaction) => new Date(transaction.date)
        );

        let monthlySavingCapacity = balance;

        if (transactionDates.length > 0) {
          const oldestDate = new Date(
            Math.min(...transactionDates)
          );

          const now = new Date();

          const monthsActive = Math.max(
            1,
            Math.ceil(
              (now - oldestDate) /
                (1000 * 60 * 60 * 24 * 30)
            )
          );

          monthlySavingCapacity = balance / monthsActive;
        }

        if (monthlySavingCapacity > 0 && remainingAmount > 0) {
          estimatedMonthsRemaining = Math.ceil(
            remainingAmount / monthlySavingCapacity
          );

          const completionDate = new Date();
          completionDate.setMonth(
            completionDate.getMonth() +
              estimatedMonthsRemaining
          );

          estimatedCompletionDate = completionDate;
        }
      }

      // Estimate future price if annual increase exists
      let projectedTargetAmount = goal.targetAmount;

      if (
        goal.expectedAnnualIncrease > 0 &&
        estimatedMonthsRemaining
      ) {
        const years =
          estimatedMonthsRemaining / 12;

        projectedTargetAmount = Number(
          (
            goal.targetAmount *
            Math.pow(
              1 + goal.expectedAnnualIncrease / 100,
              years
            )
          ).toFixed(2)
        );
      }

      let targetStatus = "calculating";

      if (goal.status === "completed") {
        targetStatus = "completed";
      } else if (goal.targetDate && estimatedCompletionDate) {
        const target = new Date(goal.targetDate);

        if (estimatedCompletionDate <= target) {
          targetStatus = "onTrack";
        } else {
          targetStatus = "behind";
        }
      }

      return {
        ...goal.toObject(),

        totalIncome,
        totalExpense,
        currentBalance: balance,

        progressPercentage,
        remainingAmount,

        estimatedMonthsRemaining,
        estimatedCompletionDate,

        projectedTargetAmount,

        targetStatus,
         insight: getGoalInsight(targetStatus),
      };
    });

    res.status(200).json({
      count: goalData.length,
      savingsGoals: goalData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch savings goals",
      error: error.message,
    });
  }
};

// Update a savings goal
const updateSavingsGoal = async (req, res) => {
  try {
    const savingsGoal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!savingsGoal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    const allowedFields = [
      "name",
      "goalType",
      "targetAmount",
      "currentSavings",
      "targetDate",
      "expectedAnnualIncrease",
      "budget",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        savingsGoal[field] = req.body[field];
      }
    });

    if (Number(savingsGoal.targetAmount) <= 0) {
      return res.status(400).json({
        message: "Target amount must be greater than zero",
      });
    }

    if (Number(savingsGoal.currentSavings) < 0) {
      return res.status(400).json({
        message: "Current savings cannot be negative",
      });
    }

    await savingsGoal.save();

    res.status(200).json({
      message: "Savings goal updated successfully",
      savingsGoal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update savings goal",
      error: error.message,
    });
  }
};

// Delete a savings goal
const deleteSavingsGoal = async (req, res) => {
  try {
    const savingsGoal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!savingsGoal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    await savingsGoal.deleteOne();

    res.status(200).json({
      message: "Savings goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete savings goal",
      error: error.message,
    });
  }
};

module.exports = {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
};