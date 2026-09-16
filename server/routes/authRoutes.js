const express = require("express");

const {
  registerUser,
  loginUser,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// Update profile / change password
router.put("/profile", protect, updateProfile);

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

module.exports = router;