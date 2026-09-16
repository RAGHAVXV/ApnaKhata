const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const {
  getBudgetInsight,
} = require("../utils/insightMessages");

// Create budget
const createBudget = async (req, res) => {
  try {
    const {
      name,
      scope,
      category,
      amount,
      period,
      startDate,
      endDate,
      warningThreshold,
    } = req.body;

    if (!name || !scope || !amount || !period || !startDate || !endDate) {
      return res.status(400).json({
        message: "Please provide all required budget details",
      });
    }

    if (!["overall", "category"].includes(scope)) {
      return res.status(400).json({
        message: "Scope must be either overall or category",
      });
    }

    if (
      !["weekly", "monthly", "custom"].includes(period)
    ) {
      return res.status(400).json({
        message: "Invalid budget period",
      });
    }

    if (scope === "category" && !category) {
      return res.status(400).json({
        message: "Category is required for a category budget",
      });
    }

    if (scope === "overall" && category) {
      return res.status(400).json({
        message: "Overall budget should not have a category",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Budget amount must be greater than zero",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    const budget = await Budget.create({
      name,
      scope,
      category: scope === "category" ? category : null,
      amount,
      period,
      startDate: start,
      endDate: end,
      warningThreshold: warningThreshold || 80,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create budget",
      error: error.message,
    });
  }
};

// Get budgets with live calculations
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    const budgetData = await Promise.all(
      budgets.map(async (budget) => {
        const transactionFilter = {
          user: req.user.id,
          type: "expense",
          date: {
            $gte: budget.startDate,
            $lte: budget.endDate,
          },
        };

        // If category budget, only calculate that category
        if (budget.scope === "category") {
          transactionFilter.category = budget.category;
        }

        const transactions = await Transaction.find(transactionFilter);

        const spent = transactions.reduce(
          (total, transaction) => total + transaction.amount,
          0
        );

        const remaining = Math.max(budget.amount - spent, 0);

        const percentageUsed =
          budget.amount > 0
            ? Number(((spent / budget.amount) * 100).toFixed(2))
            : 0;

        let status = "onTrack";

        if (percentageUsed >= 100) {
          status = "exceeded";
        } else if (percentageUsed >= budget.warningThreshold) {
          status = "warning";
        }

        const now = new Date();
        const totalDays = Math.ceil(
          (budget.endDate - budget.startDate) /
            (1000 * 60 * 60 * 24)
        );

        const daysRemaining = Math.max(
          Math.ceil(
            (budget.endDate - now) /
              (1000 * 60 * 60 * 24)
          ),
          0
        );

        return {
          ...budget.toObject(),
          spent,
          remaining,
          percentageUsed,
          status,
          totalDays,
          daysRemaining,
          insight: getBudgetInsight(status),
        };
      })
    );

    res.status(200).json({
      count: budgetData.length,
      budgets: budgetData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch budgets",
      error: error.message,
    });
  }
};

// Update budget
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    const allowedFields = [
      "name",
      "category",
      "amount",
      "period",
      "startDate",
      "endDate",
      "warningThreshold",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        budget[field] = req.body[field];
      }
    });

    if (Number(budget.amount) <= 0) {
      return res.status(400).json({
        message: "Budget amount must be greater than zero",
      });
    }

    if (new Date(budget.startDate) > new Date(budget.endDate)) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    await budget.save();

    res.status(200).json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update budget",
      error: error.message,
    });
  }
};

// Delete budget
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    await budget.deleteOne();

    res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete budget",
      error: error.message,
    });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};