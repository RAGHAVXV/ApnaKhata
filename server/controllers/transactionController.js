const Transaction = require("../models/Transaction");

const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({
        message: "Type, amount and category are required",
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date,
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add transaction",
      error: error.message,
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      search,
      minAmount,
      maxAmount,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {
      user: req.user.id,
    };

    // Validate transaction type
    if (type && !["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be either income or expense",
      });
    }

    // Filter by type
    if (type) {
      filter.type = type;
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        filter.date.$lte = end;
      }
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
      filter.amount = {};

      if (minAmount) {
        filter.amount.$gte = Number(minAmount);
      }

      if (maxAmount) {
        filter.amount.$lte = Number(maxAmount);
      }
    }

    // Search category or description
    if (search) {
      filter.$or = [
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Sorting options
    let sortOption = { date: -1 };

    if (sort === "oldest") {
      sortOption = { date: 1 };
    } else if (sort === "amountHigh") {
      sortOption = { amount: -1 };
    } else if (sort === "amountLow") {
      sortOption = { amount: 1 };
    }

    // Pagination
    const currentPage = Math.max(Number(page), 1);
    const itemsPerPage = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (currentPage - 1) * itemsPerPage;

    const totalTransactions = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(itemsPerPage);

    res.status(200).json({
      page: currentPage,
      limit: itemsPerPage,
      totalTransactions,
      totalPages: Math.ceil(totalTransactions / itemsPerPage),
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const { type, amount, category, description, date } = req.body;

    transaction.type = type || transaction.type;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description =
      description !== undefined
        ? description
        : transaction.description;
    transaction.date = date || transaction.date;

    await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update transaction",
      error: error.message,
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete transaction",
      error: error.message,
    });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};