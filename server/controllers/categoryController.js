const Category = require("../models/Category");

// Create custom category
const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Category name and type are required",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be either income or expense",
      });
    }

    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      type,
      user: req.user.id,
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      type,
      isDefault: false,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// Get default categories + user's custom categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [
        { isDefault: true },
        { user: req.user.id },
      ],
    }).sort({ type: 1, name: 1 });

    res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Update custom category
const updateCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDefault: false,
    });

    if (!category) {
      return res.status(404).json({
        message: "Custom category not found or cannot be edited",
      });
    }

    if (type && !["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be either income or expense",
      });
    }

    category.name = name || category.name;
    category.type = type || category.type;

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// Delete custom category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDefault: false,
    });

    if (!category) {
      return res.status(404).json({
        message: "Custom category not found or cannot be deleted",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};