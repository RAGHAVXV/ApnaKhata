const express = require("express");

const {
  createRecurringTransaction,
  getRecurringTransactions,
  markRecurringTransactionPaid,
  skipRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
} = require("../controllers/recurringTransactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRecurringTransaction);

router.get("/", protect, getRecurringTransactions);

router.post(
  "/:id/pay",
  protect,
  markRecurringTransactionPaid
);

router.post(
  "/:id/skip",
  protect,
  skipRecurringTransaction
);

router.put(
  "/:id",
  protect,
  updateRecurringTransaction
);

router.delete(
  "/:id",
  protect,
  deleteRecurringTransaction
);

module.exports = router;