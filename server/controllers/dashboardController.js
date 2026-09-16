const Transaction = require("../models/Transaction");

const getDashboardSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ date: -1 });

    let totalIncome = 0;
    let totalExpense = 0;

    const expenseByCategory = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      }

      if (transaction.type === "expense") {
        totalExpense += transaction.amount;

        if (!expenseByCategory[transaction.category]) {
          expenseByCategory[transaction.category] = 0;
        }

        expenseByCategory[transaction.category] += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    const recentTransactions = transactions.slice(0, 5);

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      totalTransactions: transactions.length,
      expenseByCategory,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};