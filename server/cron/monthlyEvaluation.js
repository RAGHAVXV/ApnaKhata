const cron = require("node-cron");

const Gamification = require("../models/Gamification");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");

const runMonthlyEvaluation = async () => {
  try {
    console.log("Running monthly gamification evaluation...");

    // Get previous month
    const now = new Date();

    const previousMonthDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const year = previousMonthDate.getFullYear();
    const month = previousMonthDate.getMonth();

    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

    // Get all gamification profiles
    const gamificationProfiles = await Gamification.find();

    for (const gamification of gamificationProfiles) {
      // Skip if already evaluated
      if (gamification.lastEvaluatedMonth === monthKey) {
        continue;
      }

      const userId = gamification.user;

      // Previous month's date range
      const startOfMonth = new Date(year, month, 1);

      const endOfMonth = new Date(
        year,
        month + 1,
        1
      );

      // Get user's transactions
      const transactions = await Transaction.find({
        user: userId,
        date: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });

      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach((transaction) => {
        if (transaction.type === "income") {
          totalIncome += transaction.amount;
        }

        if (transaction.type === "expense") {
          totalExpense += transaction.amount;
        }
      });

      const isSuccessful = totalIncome > totalExpense;

      // SUCCESSFUL MONTH
      if (isSuccessful) {
        gamification.totalPoints += 100;
        gamification.currentStreak += 1;
        gamification.successfulMonths += 1;

        // Update longest streak
        if (
          gamification.currentStreak >
          gamification.longestStreak
        ) {
          gamification.longestStreak =
            gamification.currentStreak;
        }

        let shieldEarned = false;

        // Earn shield after every 2 streaks
        if (gamification.currentStreak % 2 === 0) {
          gamification.streakShields += 1;
          shieldEarned = true;
        }

        // Create success notification
        await Notification.create({
          user: userId,
          type: "success",
          category: "gamification",
          title: "Month completed!",
          message: shieldEarned
            ? `Solid saving! Your streak is now ${gamification.currentStreak} and you earned a Streak Shield.`
            : `Paisa control mein raha. Your streak is now ${gamification.currentStreak}.`,
        });

        console.log(
          `User ${userId}: Successful month. Streak: ${gamification.currentStreak}`
        );
      } else {
        gamification.failedMonths += 1;

        // SHIELD AVAILABLE
        if (
          gamification.streakShields > 0 &&
          gamification.currentStreak > 0
        ) {
          // Remove one streak and consume shield
          gamification.currentStreak -= 1;
          gamification.streakShields -= 1;

          await Notification.create({
            user: userId,
            type: "warning",
            category: "gamification",
            title: "Shield saved you",
            message:
              "Thoda overspend ho gaya, but your shield took the hit. Only one streak was lost.",
          });

          console.log(
            `User ${userId}: Shield used. Streak reduced by 1.`
          );
        } else {
          const previousStreak =
            gamification.currentStreak;

          // Save old streak
          if (previousStreak > 0) {
            gamification.streakHistory.push({
              streakLength: previousStreak,
              endedAt: new Date(),
              reason: "Monthly financial target missed",
            });
          }

          // Reset streak
          gamification.currentStreak = 0;

          await Notification.create({
            user: userId,
            type: "danger",
            category: "gamification",
            title: "Streak broken",
            message:
              previousStreak > 0
                ? `This month didn't go as planned. Your ${previousStreak}-month streak is safely stored. Time for a comeback.`
                : "This month was a little rough. Next successful month starts a fresh streak.",
          });

          console.log(
            `User ${userId}: Streak broken.`
          );
        }
      }

      // Mark month as evaluated
      gamification.lastEvaluatedMonth = monthKey;

      await gamification.save();
    }

    console.log("Monthly gamification evaluation completed.");
  } catch (error) {
    console.error(
      "Monthly evaluation error:",
      error
    );
  }
};

// Run automatically on the 1st day of every month at 12:05 AM
cron.schedule("5 0 1 * *", () => {
  runMonthlyEvaluation();
});

module.exports = {
  runMonthlyEvaluation,
};