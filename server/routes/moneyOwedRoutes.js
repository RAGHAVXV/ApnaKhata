const express = require("express");

const {
  createMoneyOwed,
  getMoneyOwed,
  updateMoneyOwed,
  addRepayment,
  deleteMoneyOwed,
} = require("../controllers/moneyOwedController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  createMoneyOwed
);

router.get(
  "/",
  protect,
  getMoneyOwed
);

router.put(
  "/:id",
  protect,
  updateMoneyOwed
);

router.post(
  "/:id/repay",
  protect,
  addRepayment
);

router.delete(
  "/:id",
  protect,
  deleteMoneyOwed
);

module.exports = router;