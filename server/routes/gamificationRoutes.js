const express = require("express");

const {
  evaluateMonth,
  getGamification,
} = require("../controllers/gamificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get gamification profile
router.get("/", protect, getGamification);

// Evaluate current month's financial performance
router.post("/evaluate", protect, evaluateMonth);

module.exports = router;