const RecurringTransaction = require("../models/RecurringTransaction");
const Transaction = require("../models/Transaction");

// Calculate the next due date
const calculateNextDueDate = (date, frequency) => {
  const nextDate = new Date(date);

  if (frequency === "weekly") {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (frequency === "monthly") {
    nextDate.setMonth(nextDate.getMonth() + 1);
  } else if (frequency === "yearly") {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  }

  return nextDate;
};

// Create recurring transaction
const createRecurringTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      description,
      frequency,
      startDate,
      nextDueDate,
    } = req.body;

    if (
      !type ||
      !amount ||
      !category ||
      !frequency ||
      !nextDueDate
    ) {
      return res.status(400).json({
        message:
          "Type, amount, category, frequency and next due date are required",
      });
    }

    const recurringTransaction =
      await RecurringTransaction.create({
        user: req.user.id,
        type,
        amount,
        category,
        description,
        frequency,
        startDate: startDate || new Date(),
        nextDueDate,
      });

    res.status(201).json({
      message: "Recurring transaction created successfully",
      recurringTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create recurring transaction",
      error: error.message,
    });
  }
};

// Get all recurring transactions and update their status
const getRecurringTransactions = async (req, res) => {
  try {
    const recurringTransactions =
      await RecurringTransaction.find({
        user: req.user.id,
      }).sort({
        nextDueDate: 1,
      });

    const today = new Date();

    const updatedTransactions =
      await Promise.all(
        recurringTransactions.map(async (transaction) => {
          if (
            transaction.isActive &&
            transaction.status === "upcoming"
          ) {
            const dueDate = new Date(
              transaction.nextDueDate
            );

            dueDate.setHours(0, 0, 0, 0);

            const currentDate = new Date(today);
            currentDate.setHours(0, 0, 0, 0);

            if (
              dueDate.getTime() ===
              currentDate.getTime()
            ) {
              transaction.status = "due";
              await transaction.save();
            } else if (dueDate < currentDate) {
              transaction.status = "overdue";
              await transaction.save();
            }
          }

          return transaction;
        })
      );

    res.status(200).json({
      count: updatedTransactions.length,
      recurringTransactions: updatedTransactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recurring transactions",
      error: error.message,
    });
  }
};

// Mark recurring transaction as paid
const markRecurringTransactionPaid = async (req, res) => {
  try {
    const recurringTransaction =
      await RecurringTransaction.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!recurringTransaction) {
      return res.status(404).json({
        message: "Recurring transaction not found",
      });
    }

    // Create the actual transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      type: recurringTransaction.type,
      amount: recurringTransaction.amount,
      category: recurringTransaction.category,
      description: recurringTransaction.description,
      date: new Date(),
    });

    recurringTransaction.lastCompletedDate = new Date();

    recurringTransaction.nextDueDate =
      calculateNextDueDate(
        recurringTransaction.nextDueDate,
        recurringTransaction.frequency
      );

    recurringTransaction.status = "upcoming";

    await recurringTransaction.save();

    res.status(200).json({
      message: "Recurring transaction marked as paid",
      transaction,
      recurringTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to mark recurring transaction as paid",
      error: error.message,
    });
  }
};

// Skip recurring transaction
const skipRecurringTransaction = async (req, res) => {
  try {
    const recurringTransaction =
      await RecurringTransaction.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!recurringTransaction) {
      return res.status(404).json({
        message: "Recurring transaction not found",
      });
    }

    recurringTransaction.status = "skipped";

    recurringTransaction.nextDueDate =
      calculateNextDueDate(
        recurringTransaction.nextDueDate,
        recurringTransaction.frequency
      );

    recurringTransaction.status = "upcoming";

    await recurringTransaction.save();

    res.status(200).json({
      message: "Recurring transaction skipped",
      recurringTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to skip recurring transaction",
      error: error.message,
    });
  }
};

// Update recurring transaction
const updateRecurringTransaction = async (req, res) => {
  try {
    const recurringTransaction =
      await RecurringTransaction.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!recurringTransaction) {
      return res.status(404).json({
        message: "Recurring transaction not found",
      });
    }

    const {
      type,
      amount,
      category,
      description,
      frequency,
      startDate,
      nextDueDate,
    } = req.body;

    if (
      type !== undefined &&
      !["income", "expense"].includes(type)
    ) {
      return res.status(400).json({
        message: "Invalid transaction type",
      });
    }

    if (
      frequency !== undefined &&
      !["weekly", "monthly", "yearly"].includes(
        frequency
      )
    ) {
      return res.status(400).json({
        message: "Invalid frequency",
      });
    }

    if (
      amount !== undefined &&
      (Number(amount) <= 0 || Number.isNaN(Number(amount)))
    ) {
      return res.status(400).json({
        message: "Amount must be greater than zero",
      });
    }

    if (
      category !== undefined &&
      !String(category).trim()
    ) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    const updatedStartDate =
      startDate !== undefined
        ? startDate
        : recurringTransaction.startDate;

    const updatedNextDueDate =
      nextDueDate !== undefined
        ? nextDueDate
        : recurringTransaction.nextDueDate;

    if (
      updatedStartDate &&
      updatedNextDueDate &&
      new Date(updatedStartDate) >
        new Date(updatedNextDueDate)
    ) {
      return res.status(400).json({
        message:
          "Next due date must be on or after the start date",
      });
    }

    if (type !== undefined) {
      recurringTransaction.type = type;
    }

    if (amount !== undefined) {
      recurringTransaction.amount = Number(amount);
    }

    if (category !== undefined) {
      recurringTransaction.category =
        String(category).trim();
    }

    if (description !== undefined) {
      recurringTransaction.description =
        String(description).trim();
    }

    if (frequency !== undefined) {
      recurringTransaction.frequency = frequency;
    }

    if (startDate !== undefined) {
      recurringTransaction.startDate = startDate;
    }

    if (nextDueDate !== undefined) {
      recurringTransaction.nextDueDate = nextDueDate;

      // Recalculate current status based on the new due date
      recurringTransaction.status = "upcoming";
    }

    await recurringTransaction.save();

    res.status(200).json({
      message:
        "Recurring transaction updated successfully",
      recurringTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to update recurring transaction",
      error: error.message,
    });
  }
};

// Delete recurring transaction
const deleteRecurringTransaction = async (req, res) => {
  try {
    const recurringTransaction =
      await RecurringTransaction.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!recurringTransaction) {
      return res.status(404).json({
        message: "Recurring transaction not found",
      });
    }

    await recurringTransaction.deleteOne();

    res.status(200).json({
      message:
        "Recurring transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to delete recurring transaction",
      error: error.message,
    });
  }
};

module.exports = {
  createRecurringTransaction,
  getRecurringTransactions,
  markRecurringTransactionPaid,
  skipRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
};