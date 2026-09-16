const express = require("express");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const savingsGoalRoutes = require("./routes/savingsGoalRoutes");
const insightRoutes = require("./routes/insightRoutes");
const recurringTransactionRoutes = require("./routes/recurringTransactionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const gamificationRoutes = require("./routes/gamificationRoutes");
const moneyOwedRoutes = require("./routes/moneyOwedRoutes");
require("./cron/monthlyEvaluation");
const cors = require("cors");
dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/savings-goals", savingsGoalRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/recurring-transactions", recurringTransactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/money-owed",moneyOwedRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Apna Khata server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});