const express = require("express");

const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBudget);
router.get("/", protect, getBudgets);
router.put("/:id", protect, updateBudget);
router.delete("/:id", protect, deleteBudget);

module.exports = router;