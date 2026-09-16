const Gamification = require("../models/Gamification");
const Transaction = require("../models/Transaction");

const evaluateMonth = async (req, res) => {
  try {
    const userId = req.user.id;

    // Optional month for testing: YYYY-MM
const requestedMonth = req.query.month;

let now = new Date();

if (requestedMonth) {
  const [year, month] = requestedMonth.split("-").map(Number);

  if (
    !year ||
    !month ||
    month < 1 ||
    month > 12
  ) {
    return res.status(400).json({
      message:
        "Month format sahi do bhai , Use YYYY-MM",
    });
  }

  now = new Date(year, month - 1, 1);
}

const monthKey = `${now.getFullYear()}-${String(
  now.getMonth() + 1
).padStart(2, "0")}`;

    // Find or create gamification profile
    let gamification = await Gamification.findOne({
      user: userId,
    });

    if (!gamification) {
      gamification = await Gamification.create({
        user: userId,
      });
    }

    // Prevent evaluating the same month twice
    if (gamification.lastEvaluatedMonth === monthKey) {
      return res.status(400).json({
        message: "Is month ka evaluation already ho chuka hai 😄",
        gamification,
      });
    }

    // Start and end of current month
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    // Get current month's transactions
    const transactions = await Transaction.find({
      user: userId,
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    // Calculate income and expenses
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

    // A successful month means income is greater than expense
    const isSuccessful = totalIncome > totalExpense;

    let resultMessage = "";
    let pointsEarned = 0;
    let shieldUsed = false;
    let shieldEarned = false;

    // =====================================
    // SUCCESSFUL MONTH
    // =====================================
    if (isSuccessful) {
      pointsEarned = 100;

      gamification.totalPoints += pointsEarned;
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

      // Earn 1 shield after every 2 successful streaks
      if (gamification.currentStreak % 2 === 0) {
        gamification.streakShields += 1;
        shieldEarned = true;

        resultMessage =
          "Mast! Is month paisa control mein raha 😎🔥 Streak badh gayi aur tumne ek Streak Shield bhi earn kar liya 🛡️";
      } else {
        resultMessage =
          "Mast! Is month paisa control mein raha 😎🔥 Streak badh gayi!";
      }
    }

    // =====================================
    // FAILED MONTH
    // =====================================
    else {
      gamification.failedMonths += 1;

      // Shield available
      if (
        gamification.streakShields > 0 &&
        gamification.currentStreak > 0
      ) {
        // Use shield but keep streak unchanged
        gamification.streakShields -= 1;
        shieldUsed = true;

        resultMessage =
          "Thoda overspend ho gaya 😅 But chill! Shield ne tumhari streak bacha li 🛡️🔥";
      } else {
        // Save streak before resetting
        if (gamification.currentStreak > 0) {
          gamification.streakHistory.push({
            streakLength: gamification.currentStreak,
            endedAt: new Date(),
            reason: "Monthly financial target missed",
          });
        }

        // Reset streak completely
        gamification.currentStreak = 0;

        resultMessage =
          "Is baar streak toot gayi 😭 Koi na bhai, next month comeback starts from 1! 🔥";
      }
    }

    // Mark month as evaluated
    gamification.lastEvaluatedMonth = monthKey;

    await gamification.save();

    res.status(200).json({
      message: resultMessage,

      evaluation: {
        month: monthKey,
        totalIncome,
        totalExpense,
        successful: isSuccessful,
        pointsEarned,
        shieldEarned,
        shieldUsed,
      },

      gamification,
    });
  } catch (error) {
    console.error(
      "Gamification evaluation error:",
      error
    );

    res.status(500).json({
      message:
        "Gamification ka hisaab thoda gadbad ho gaya 😭",
      error: error.message,
    });
  }
};

const getGamification = async (req, res) => {
  try {
    const userId = req.user.id;

    let gamification = await Gamification.findOne({
      user: userId,
    });

    // Create profile automatically if it doesn't exist
    if (!gamification) {
      gamification = await Gamification.create({
        user: userId,
      });
    }

    res.status(200).json({
      gamification,
    });
  } catch (error) {
    console.error(
      "Gamification fetch error:",
      error
    );

    res.status(500).json({
      message:
        "Gamification data load nahi ho paya 😭",
      error: error.message,
    });
  }
};

module.exports = {
  evaluateMonth,
  getGamification,
};