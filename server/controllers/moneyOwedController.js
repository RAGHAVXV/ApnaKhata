const MoneyOwed = require("../models/MoneyOwed");

const calculateStatus = (
  moneyOwed,
  remainingAmount
) => {
  if (remainingAmount <= 0) {
    return "settled";
  }

  if (!moneyOwed.dueDate) {
    if (moneyOwed.repayments.length > 0) {
      return "partiallyPaid";
    }

    return "pending";
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(
    moneyOwed.dueDate
  );

  dueDate.setHours(0, 0, 0, 0);

  const differenceInDays = Math.ceil(
    (dueDate - today) /
      (1000 * 60 * 60 * 24)
  );

  if (differenceInDays < 0) {
    return "overdue";
  }

  if (differenceInDays <= 3) {
    return "dueSoon";
  }

  if (moneyOwed.repayments.length > 0) {
    return "partiallyPaid";
  }

  return "pending";
};

const buildMoneyOwedData = (moneyOwed) => {
  const totalRepaid =
    moneyOwed.repayments.reduce(
      (total, repayment) =>
        total + Number(repayment.amount),
      0
    );

  const remainingAmount = Math.max(
    Number(moneyOwed.amount) - totalRepaid,
    0
  );

  const status = calculateStatus(
    moneyOwed,
    remainingAmount
  );

  return {
    ...moneyOwed.toObject(),

    totalRepaid,

    remainingAmount,

    status,
  };
};


// Create money owed record

const createMoneyOwed = async (req, res) => {
  try {
    const {
      person,
      type,
      amount,
      date,
      method,
      reason,
      dueDate,
      notes,
    } = req.body;

    if (
      !person ||
      !type ||
      !amount ||
      !date
    ) {
      return res.status(400).json({
        message:
          "Person, type, amount and date are required",
      });
    }

    if (
      !["given", "borrowed"].includes(type)
    ) {
      return res.status(400).json({
        message:
          "Type must be either given or borrowed",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message:
          "Amount must be greater than zero",
      });
    }

    if (
      dueDate &&
      new Date(dueDate) < new Date(date)
    ) {
      return res.status(400).json({
        message:
          "Due date cannot be before the transaction date",
      });
    }

    const moneyOwed =
      await MoneyOwed.create({
        user: req.user.id,
        person: person.trim(),
        type,
        amount: Number(amount),
        date,
        method: method || "cash",
        reason: reason?.trim() || "",
        dueDate: dueDate || null,
        notes: notes?.trim() || "",
      });

    res.status(201).json({
      message:
        "Money owed record created successfully",

      moneyOwed:
        buildMoneyOwedData(moneyOwed),
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to create money owed record",

      error: error.message,
    });
  }
};


// Get all money owed records

const getMoneyOwed = async (req, res) => {
  try {
    const records =
      await MoneyOwed.find({
        user: req.user.id,
      }).sort({
        dueDate: 1,
        date: -1,
      });

    const moneyOwed = records.map(
      buildMoneyOwedData
    );

    const totalGiven = moneyOwed
      .filter(
        (item) => item.type === "given"
      )
      .reduce(
        (total, item) =>
          total + item.remainingAmount,
        0
      );

    const totalBorrowed = moneyOwed
      .filter(
        (item) => item.type === "borrowed"
      )
      .reduce(
        (total, item) =>
          total + item.remainingAmount,
        0
      );

    const totalDueSoon = moneyOwed
      .filter(
        (item) =>
          item.status === "dueSoon"
      )
      .reduce(
        (total, item) =>
          total + item.remainingAmount,
        0
      );

    const totalOverdue = moneyOwed
      .filter(
        (item) =>
          item.status === "overdue"
      )
      .reduce(
        (total, item) =>
          total + item.remainingAmount,
        0
      );

    res.status(200).json({
      count: moneyOwed.length,

      summary: {
        totalGiven,
        totalBorrowed,
        totalDueSoon,
        totalOverdue,
      },

      moneyOwed,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch money owed records",

      error: error.message,
    });
  }
};


// Update main record

const updateMoneyOwed = async (
  req,
  res
) => {
  try {
    const moneyOwed =
      await MoneyOwed.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!moneyOwed) {
      return res.status(404).json({
        message:
          "Money owed record not found",
      });
    }

    const allowedFields = [
      "person",
      "type",
      "amount",
      "date",
      "method",
      "reason",
      "dueDate",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (
        req.body[field] !== undefined
      ) {
        moneyOwed[field] =
          req.body[field];
      }
    });

    if (Number(moneyOwed.amount) <= 0) {
      return res.status(400).json({
        message:
          "Amount must be greater than zero",
      });
    }

    if (
      moneyOwed.dueDate &&
      new Date(moneyOwed.dueDate) <
        new Date(moneyOwed.date)
    ) {
      return res.status(400).json({
        message:
          "Due date cannot be before the transaction date",
      });
    }

    await moneyOwed.save();

    res.status(200).json({
      message:
        "Money owed record updated successfully",

      moneyOwed:
        buildMoneyOwedData(moneyOwed),
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to update money owed record",

      error: error.message,
    });
  }
};


// Add repayment

const addRepayment = async (
  req,
  res
) => {
  try {
    const moneyOwed =
      await MoneyOwed.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!moneyOwed) {
      return res.status(404).json({
        message:
          "Money owed record not found",
      });
    }

    const {
      amount,
      date,
      method,
      note,
    } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message:
          "Repayment amount must be greater than zero",
      });
    }

    const totalRepaid =
      moneyOwed.repayments.reduce(
        (total, repayment) =>
          total +
          Number(repayment.amount),
        0
      );

    const remainingAmount =
      moneyOwed.amount - totalRepaid;

    if (
      Number(amount) >
      remainingAmount
    ) {
      return res.status(400).json({
        message:
          "Repayment cannot be greater than the remaining amount",
      });
    }

    moneyOwed.repayments.push({
      amount: Number(amount),
      date: date || new Date(),
      method: method || "cash",
      note: note?.trim() || "",
    });

    await moneyOwed.save();

    res.status(200).json({
      message:
        "Repayment added successfully",

      moneyOwed:
        buildMoneyOwedData(moneyOwed),
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to add repayment",

      error: error.message,
    });
  }
};


// Delete record

const deleteMoneyOwed = async (
  req,
  res
) => {
  try {
    const moneyOwed =
      await MoneyOwed.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!moneyOwed) {
      return res.status(404).json({
        message:
          "Money owed record not found",
      });
    }

    await moneyOwed.deleteOne();

    res.status(200).json({
      message:
        "Money owed record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to delete money owed record",

      error: error.message,
    });
  }
};


module.exports = {
  createMoneyOwed,
  getMoneyOwed,
  updateMoneyOwed,
  addRepayment,
  deleteMoneyOwed,
};