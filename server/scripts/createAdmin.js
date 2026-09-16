require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({
      email: "raghavoppari7@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "raghav@955201",
      10
    );

    await User.create({
      name: "Raghav",
      email: "raghavoppari7@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();