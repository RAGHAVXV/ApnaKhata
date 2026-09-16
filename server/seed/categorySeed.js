const dotenv = require("dotenv");

const connectDB = require("../config/db");
const Category = require("../models/Category");

dotenv.config();

const defaultCategories = [
  // Income
  { name: "Salary", type: "income", isDefault: true },
  { name: "Business", type: "income", isDefault: true },
  { name: "Freelance", type: "income", isDefault: true },
  { name: "Investment", type: "income", isDefault: true },
  { name: "Rental Income", type: "income", isDefault: true },
  { name: "Gift", type: "income", isDefault: true },
  { name: "Refund", type: "income", isDefault: true },
  { name: "Other", type: "income", isDefault: true },

  // Expense
  { name: "Food & Dining", type: "expense", isDefault: true },
  { name: "Transport", type: "expense", isDefault: true },
  { name: "Shopping", type: "expense", isDefault: true },
  { name: "Bills & Utilities", type: "expense", isDefault: true },
  { name: "Rent", type: "expense", isDefault: true },
  { name: "EMI / Loans", type: "expense", isDefault: true },
  { name: "Healthcare", type: "expense", isDefault: true },
  { name: "Education", type: "expense", isDefault: true },
  { name: "Entertainment", type: "expense", isDefault: true },
  { name: "Subscriptions", type: "expense", isDefault: true },
  { name: "Travel", type: "expense", isDefault: true },
  { name: "Insurance", type: "expense", isDefault: true },
  { name: "Other", type: "expense", isDefault: true },
];

const seedCategories = async () => {
  try {
    await connectDB();

    // Remove old default categories to avoid duplicates
    await Category.deleteMany({
      isDefault: true,
    });

    // Insert fresh default categories
    await Category.insertMany(defaultCategories);

    console.log("Default categories added successfully");

    process.exit();
  } catch (error) {
    console.error("Failed to seed categories:", error.message);
    process.exit(1);
  }
};

seedCategories();