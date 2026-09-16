const Budget = require("../models/Budget");
const SavingsGoal = require("../models/SavingsGoal");
const RecurringTransaction = require("../models/RecurringTransaction");
const Notification = require("../models/Notification");

// =========================
// GET NOTIFICATIONS
// =========================
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = [];

    // =========================
    // STORED NOTIFICATIONS
    // =========================
    const storedNotifications = await Notification.find({
      user: userId,
    }).sort({ createdAt: -1 });

    storedNotifications.forEach((notification) => {
      notifications.push({
        id: notification._id,
        type: notification.type,
        category: notification.category,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      });
    });

    // =========================
    // BUDGET NOTIFICATIONS
    // =========================
    const budgets = await Budget.find({ user: userId });

    budgets.forEach((budget) => {
      if (budget.status === "exceeded") {
        notifications.push({
          type: "danger",
          category: "budget",
          title: "Budget crossed",
          message: `${budget.name} ka budget ud gaya. You're over the limit!`,
        });
      } else if (
        budget.percentageUsed >= budget.warningThreshold
      ) {
        notifications.push({
          type: "warning",
          category: "budget",
          title: "Budget warning",
          message: `${budget.name} budget dheere dheere limit ke paas ja raha hai.`,
        });
      } else {
        notifications.push({
          type: "success",
          category: "budget",
          title: "Budget looking good",
          message: `${budget.name} is under control. Paisa sambhal ke chal raha hai!`,
        });
      }
    });

    // =========================
    // SAVINGS GOAL NOTIFICATIONS
    // =========================
    const savingsGoals = await SavingsGoal.find({
      user: userId,
      status: "active",
    });

    savingsGoals.forEach((goal) => {
      if (goal.targetStatus === "behind") {
        notifications.push({
          type: "warning",
          category: "savings",
          title: "Savings needs attention",
          message: `${goal.name} thoda peeche chal raha hai. Thoda extra save karna padega bhai!`,
        });
      } else if (goal.progressPercentage >= 100) {
        notifications.push({
          type: "success",
          category: "savings",
          title: "Goal completed",
          message: `${goal.name} complete! Paisa bol raha hai: mission accomplished.`,
        });
      } else {
        notifications.push({
          type: "success",
          category: "savings",
          title: "Savings on track",
          message: `${goal.name} mast chal raha hai. Bas consistency maintain karo!`,
        });
      }
    });

    // =========================
    // RECURRING TRANSACTION
    // NOTIFICATIONS
    // =========================
    const recurringTransactions =
      await RecurringTransaction.find({
        user: userId,
        isActive: true,
      });

    recurringTransactions.forEach((transaction) => {
      if (transaction.status === "due") {
        notifications.push({
          type: "danger",
          category: "recurring",
          title: "Payment due",
          message: `${
            transaction.description ||
            transaction.category
          } ka payment due hai! Bhool mat jaana.`,
        });
      } else if (transaction.status === "upcoming") {
        notifications.push({
          type: "warning",
          category: "recurring",
          title: "Payment coming soon",
          message: `${
            transaction.description ||
            transaction.category
          } ka payment jaldi due hone wala hai.`,
        });
      }
    });

    res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Notification error:", error);

    res.status(500).json({
      message: "Notifications load nahi ho payi.",
      error: error.message,
    });
  }
};

// =========================
// MARK ONE AS READ
// =========================
const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user: userId,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification nahi mili.",
      });
    }

    res.status(200).json({
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    res.status(500).json({
      message: "Notification update nahi ho payi.",
      error: error.message,
    });
  }
};

// =========================
// MARK ALL AS READ
// =========================
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      {
        user: userId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);

    res.status(500).json({
      message: "Notifications update nahi ho payi.",
      error: error.message,
    });
  }
};

// =========================
// DELETE NOTIFICATION
// =========================
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification nahi mili.",
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    res.status(500).json({
      message: "Notification delete nahi ho payi.",
      error: error.message,
    });
  }
};
const createNotification = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      type,
      title,
      message,
      category,
    } = req.body;

    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      category,
    });

    res.status(201).json({
      message: "Notification created successfully.",
      notification,
    });
  } catch (error) {
    console.error("Create notification error:", error);

    res.status(500).json({
      message: "Notification create nahi ho payi.",
      error: error.message,
    });
  }
};
module.exports = {
   createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};