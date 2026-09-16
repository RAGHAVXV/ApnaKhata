import { useEffect, useState } from "react";
import {
  Trophy,
  Flame,
  Star,
  Shield,
  CheckCircle,
  XCircle,
  CalendarDays,
  RefreshCw,
  TrendingUp,
  History,
  Award,
} from "lucide-react";
import api from "../services/api";

function Gamification() {
  const [gamification, setGamification] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);

  // Used because backend supports YYYY-MM for testing
  const [evaluationMonth, setEvaluationMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // =========================
  // FETCH GAMIFICATION
  // =========================
  const fetchGamification = async () => {
    try {
      setLoading(true);

      const response = await api.get("/gamification");

      setGamification(response.data.gamification);
    } catch (error) {
      console.error("Gamification fetch error:", error);

      alert(
        error.response?.data?.message ||
          "Gamification data load nahi ho paya."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamification();
  }, []);

  // =========================
  // EVALUATE MONTH
  // =========================
  const evaluateMonth = async () => {
    if (!evaluationMonth) {
      alert("Please select a month.");
      return;
    }

    try {
      setEvaluating(true);

      const response = await api.post(
        `/gamification/evaluate?month=${evaluationMonth}`
      );

      setEvaluation(response.data.evaluation);
      setGamification(response.data.gamification);

      alert(
        response.data.message ||
          "Month evaluated successfully."
      );
    } catch (error) {
      console.error("Gamification evaluation error:", error);

      alert(
        error.response?.data?.message ||
          "Gamification evaluation failed."
      );
    } finally {
      setEvaluating(false);
    }
  };

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // MONTH FORMAT
  // =========================
  const formatMonth = (month) => {
    if (!month) return "-";

    const [year, monthNumber] = month.split("-");

    const date = new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    );

    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-100px)] p-6 md:p-8">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-200 bg-purple-50 text-purple-600 shadow-sm dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300">
              <RefreshCw
                size={26}
                className="animate-spin"
              />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Loading your streaks...
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Getting your gamification data
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // DEFAULT DATA
  // =========================
  const data = gamification || {
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    successfulMonths: 0,
    failedMonths: 0,
    streakShields: 0,
    streakHistory: [],
    lastEvaluatedMonth: null,
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =========================
            HEADER
        ========================= */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 shadow-sm dark:border-purple-900/50 dark:from-purple-950/60 dark:to-indigo-950/60 dark:text-purple-300">
                <Trophy size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  Streaks & Rewards
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Save consistently, build your streak, and earn rewards.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchGamification}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:text-purple-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-purple-700 dark:hover:text-purple-300"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* =========================
            MAIN STATS
        ========================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* CURRENT STREAK */}
          <div className="group rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-orange-900/40 dark:from-orange-950/40 dark:via-slate-900 dark:to-amber-950/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-300">
                  Current Streak
                </p>

                <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
                  {data.currentStreak}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Successful months in a row
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300">
                <Flame size={24} />
              </div>
            </div>
          </div>

          {/* LONGEST STREAK */}
          <div className="group rounded-2xl border border-green-200/80 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-green-900/40 dark:from-green-950/40 dark:via-slate-900 dark:to-emerald-950/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-300">
                  Longest Streak
                </p>

                <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
                  {data.longestStreak}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Your personal best
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          {/* POINTS */}
          <div className="group rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-purple-900/40 dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                  Total Points
                </p>

                <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
                  {data.totalPoints}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Points earned
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                <Star size={24} />
              </div>
            </div>
          </div>

          {/* SHIELDS */}
          <div className="group rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-blue-900/40 dark:from-blue-950/40 dark:via-slate-900 dark:to-cyan-950/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-300">
                  Streak Shields
                </p>

                <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
                  {data.streakShields}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Shields available
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                <Shield size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            MONTHLY PERFORMANCE
        ========================= */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80">

          <div className="border-b border-slate-200/80 px-5 py-5 sm:px-6 dark:border-slate-700/70">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Monthly Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Evaluate your financial performance
            </p>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:px-6">
            <div className="w-full sm:max-w-xs">
              <label
                htmlFor="evaluationMonth"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Evaluation Month
              </label>

              <input
                id="evaluationMonth"
                type="month"
                value={evaluationMonth}
                onChange={(e) =>
                  setEvaluationMonth(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={evaluateMonth}
              disabled={evaluating}
              className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CalendarDays size={18} />

              {evaluating
                ? "Evaluating..."
                : "Evaluate Month"}
            </button>
          </div>

          {data.lastEvaluatedMonth && (
            <div className="mx-5 mb-5 rounded-xl border border-purple-100 bg-purple-50/70 px-4 py-3 text-sm text-purple-700 sm:mx-6 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300">
              <strong>Last Evaluated:</strong>{" "}
              {formatMonth(data.lastEvaluatedMonth)}
            </div>
          )}
        </section>

        {/* =========================
            LATEST EVALUATION
        ========================= */}
        {evaluation && (
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80">

            <div className="flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-700/70">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Latest Evaluation
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {formatMonth(evaluation.month)}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  evaluation.successful
                    ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
                }`}
              >
                {evaluation.successful ? (
                  <CheckCircle size={27} />
                ) : (
                  <XCircle size={27} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Income
                </span>

                <strong className="mt-2 block text-xl font-bold text-green-600 dark:text-green-400">
                  ₹
                  {Number(
                    evaluation.totalIncome || 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Expense
                </span>

                <strong className="mt-2 block text-xl font-bold text-red-600 dark:text-red-400">
                  ₹
                  {Number(
                    evaluation.totalExpense || 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Result
                </span>

                <strong
                  className={`mt-2 block text-xl font-bold ${
                    evaluation.successful
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {evaluation.successful
                    ? "Successful"
                    : "Failed"}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Points Earned
                </span>

                <strong className="mt-2 block text-xl font-bold text-purple-600 dark:text-purple-400">
                  +{evaluation.pointsEarned}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Shield Earned
                </span>

                <strong className="mt-2 block text-xl font-bold text-blue-600 dark:text-blue-400">
                  {evaluation.shieldEarned
                    ? "Yes 🛡️"
                    : "No"}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Shield Used
                </span>

                <strong className="mt-2 block text-xl font-bold text-orange-600 dark:text-orange-400">
                  {evaluation.shieldUsed
                    ? "Yes 🛡️"
                    : "No"}
                </strong>
              </div>
            </div>
          </section>
        )}

        {/* =========================
            YOUR PROGRESS
        ========================= */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80">

          <div className="border-b border-slate-200/80 px-5 py-5 sm:px-6 dark:border-slate-700/70">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Overall monthly performance
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:p-6">

            <div className="rounded-xl border border-green-200 bg-green-50/70 p-4 dark:border-green-900/50 dark:bg-green-950/30">
              <span className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-300">
                Successful Months
              </span>

              <strong className="mt-2 block text-2xl font-black text-slate-900 dark:text-white">
                {data.successfulMonths}
              </strong>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 dark:border-red-900/50 dark:bg-red-950/30">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-300">
                Failed Months
              </span>

              <strong className="mt-2 block text-2xl font-black text-slate-900 dark:text-white">
                {data.failedMonths}
              </strong>
            </div>

            <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4 dark:border-orange-900/50 dark:bg-orange-950/30">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-300">
                Current Streak
              </span>

              <strong className="mt-2 block text-2xl font-black text-slate-900 dark:text-white">
                🔥 {data.currentStreak}
              </strong>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4 dark:border-purple-900/50 dark:bg-purple-950/30">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                Best Streak
              </span>

              <strong className="mt-2 block text-2xl font-black text-slate-900 dark:text-white">
                🏆 {data.longestStreak}
              </strong>
            </div>
          </div>
        </section>

        {/* =========================
            STREAK SHIELDS
        ========================= */}
        <section className="overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-sm dark:border-blue-900/50 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/30">

          <div className="flex items-center justify-between border-b border-blue-100/80 px-5 py-5 sm:px-6 dark:border-blue-900/40">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Streak Shields
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Protection against a failed month
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              <Shield size={25} />
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {data.streakShields}
              </span>

              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                shield
                {data.streakShields !== 1 ? "s" : ""} available
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-blue-100 bg-white/70 p-4 text-sm leading-6 text-slate-600 dark:border-blue-900/40 dark:bg-slate-900/50 dark:text-slate-300">
              Earn 1 shield after every 2 successful streaks.
              If a month goes badly, a shield protects your
              current streak.
            </div>
          </div>
        </section>

        {/* =========================
            STREAK HISTORY
        ========================= */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80">

          <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-5 sm:px-6 dark:border-slate-700/70">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Streak History
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Previous completed or broken streaks
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
              <History size={24} />
            </div>
          </div>

          {data.streakHistory &&
          data.streakHistory.length > 0 ? (
            <div className="divide-y divide-slate-200/80 dark:divide-slate-700/70">
              {data.streakHistory
                .slice()
                .reverse()
                .map((history, index) => (
                  <div
                    key={`${history.endedAt}-${index}`}
                    className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                        <Award size={21} />
                      </div>

                      <div>
                        <strong className="block text-sm font-bold text-slate-900 dark:text-white">
                          {history.streakLength} month
                          {history.streakLength !== 1
                            ? "s"
                            : ""}{" "}
                          streak
                        </strong>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {history.reason}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-slate-500 sm:text-right dark:text-slate-400">
                      Ended: {formatDate(history.endedAt)}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <History size={34} />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                No streak history yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Keep going. Your first completed or broken
                streak will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Gamification;