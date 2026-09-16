const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const SavingsGoal = require("../models/SavingsGoal");

const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    const insights = [];

    // Get user data
    const transactions = await Transaction.find({
      user: userId,
    });

    const budgets = await Budget.find({
      user: userId,
    });

    const savingsGoals = await SavingsGoal.find({
      user: userId,
    });

    // -----------------------------
    // Calculate income and expenses
    // -----------------------------

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

    // -----------------------------
    // Overall spending insight
    // -----------------------------

    if (totalIncome > 0) {
      const spendingPercentage =
        (totalExpense / totalIncome) * 100;

      if (spendingPercentage >= 90) {
        insights.push({
          type: "warning",
          category: "spending",
          priority: "high",

          title: "Bhai, paisa thoda fast bhaag raha hai 😭",

          message: `You've already spent ${spendingPercentage.toFixed(
            1
          )}% of your income.`,

          punchline:
            "Thoda brake lagao, wallet Formula 1 mein nahi hai 😂",
        });
      } else if (spendingPercentage <= 50) {
        insights.push({
          type: "positive",
          category: "spending",
          priority: "low",

          title: "Nice control, yaar 😎",

          message: `You've spent only ${spendingPercentage.toFixed(
            1
          )}% of your income so far.`,

          punchline:
            "Aise hi chala toh month-end pe bhi paisa dikhega 😂",
        });
      }
    }

    // -----------------------------
    // Budget insights
    // -----------------------------

    budgets.forEach((budget) => {
      const budgetTransactions = transactions.filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category === budget.category
      );

      const spent = budgetTransactions.reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

      const percentageUsed =
        budget.amount > 0
          ? (spent / budget.amount) * 100
          : 0;

      const remaining = budget.amount - spent;

      if (percentageUsed >= 100) {
        insights.push({
          type: "danger",
          category: "budget",
          priority: "high",

          title: "Arre yaar, budget cross ho gaya 💀",

          message: `You've exceeded your ${budget.category} budget by ₹${Math.abs(
            remaining
          ).toFixed(2)}.`,

          punchline:
            "Wallet ko bhi thoda rest de do bhai 😂",

          budgetId: budget._id,
        });
      } else if (percentageUsed >= 80) {
        insights.push({
          type: "warning",
          category: "budget",
          priority: "medium",

          title: "Careful yaar 😅",

          message: `You've already used ${percentageUsed.toFixed(
            1
          )}% of your ${budget.category} budget.`,

          punchline:
            "Thoda sambhal ke, warna month-end interesting ho jayega 😂",

          budgetId: budget._id,
        });
      }
    });

    // -----------------------------
    // Savings goal insights
    // -----------------------------

    savingsGoals.forEach((goal) => {
      const progress =
        goal.targetAmount > 0
          ? (goal.currentSavings /
              goal.targetAmount) *
            100
          : 0;

      if (goal.status === "completed") {
        insights.push({
          type: "achievement",
          category: "goal",
          priority: "high",

          title: "Goal done, bhai! 🎉",

          message: `You've successfully reached your ${goal.name} goal.`,

          punchline:
            "Celebration banta hai, bas budget ke andar 😎",

          goalId: goal._id,
        });
      } else if (progress >= 80) {
        insights.push({
          type: "positive",
          category: "goal",
          priority: "medium",

          title: "Bas thoda aur, yaar 🔥",

          message: `You're ${progress.toFixed(
            1
          )}% closer to your ${goal.name} goal.`,

          punchline:
            "Finish line saamne hai, ab toh pakad lo 😎",

          goalId: goal._id,
        });
      } else if (progress <= 20) {
        insights.push({
          type: "info",
          category: "goal",
          priority: "low",

          title: "Goal ka journey start ho gaya 🎯",

          message: `You've completed ${progress.toFixed(
            1
          )}% of your ${goal.name} goal so far.`,

          punchline:
            "Slow and steady bhi chalega, bas rukna mat bhai 😄",

          goalId: goal._id,
        });
      }
    });

    // -----------------------------
    // No insights fallback
    // -----------------------------

    if (insights.length === 0) {
      insights.push({
        type: "info",
        category: "general",
        priority: "low",

        title: "Sab sorted lag raha hai 😎",

        message:
          "Your finances are looking stable right now.",

        punchline:
          "Enjoy karo bhai, but transactions add karna mat bhoolna 😂",
      });
    }

    // -----------------------------
    // Sort important insights first
    // -----------------------------

    const priorityOrder = {
      high: 1,
      medium: 2,
      low: 3,
    };

    insights.sort(
      (a, b) =>
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
    );

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,

      count: insights.length,

      insights,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate insights",
      error: error.message,
    });
  }
};

module.exports = {
  getInsights,
};