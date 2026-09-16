const express = require("express");

const {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a notification
router.post("/", protect, createNotification);

// Get all notifications
router.get("/", protect, getNotifications);

// Mark all notifications as read
router.patch("/read-all", protect, markAllNotificationsAsRead);

// Mark one notification as read
router.patch("/:id/read", protect, markNotificationAsRead);

// Delete one notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;