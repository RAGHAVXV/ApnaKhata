import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Trophy,
  Target,
  CircleAlert,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

function Insights() {
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    count: 0,
    insights: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/insights");

      setData({
        totalIncome: response.data.totalIncome || 0,
        totalExpense: response.data.totalExpense || 0,
        balance: response.data.balance || 0,
        count: response.data.count || 0,
        insights: response.data.insights || [],
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load insights."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getSpendingPercentage = () => {
    if (data.totalIncome <= 0) {
      return 0;
    }

    return (data.totalExpense / data.totalIncome) * 100;
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case "positive":
        return <CheckCircle size={21} strokeWidth={2.2} />;

      case "warning":
        return <AlertTriangle size={21} strokeWidth={2.2} />;

      case "danger":
        return <CircleAlert size={21} strokeWidth={2.2} />;

      case "achievement":
        return <Trophy size={21} strokeWidth={2.2} />;

      case "info":
        return <Lightbulb size={21} strokeWidth={2.2} />;

      default:
        return <Lightbulb size={21} strokeWidth={2.2} />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "spending":
        return <Wallet size={15} strokeWidth={2.2} />;

      case "budget":
        return <TrendingDown size={15} strokeWidth={2.2} />;

      case "goal":
        return <Target size={15} strokeWidth={2.2} />;

      default:
        return <Lightbulb size={15} strokeWidth={2.2} />;
    }
  };

  const getInsightCardStyle = (type) => {
    switch (type) {
      case "positive":
        return {
          card:
            "border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:border-emerald-900/60 dark:from-emerald-950/30 dark:via-[#15151d] dark:to-green-950/20",
          icon:
            "border-emerald-200 bg-emerald-100 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400",
          category:
            "border-emerald-200 bg-emerald-100/80 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
        };

      case "warning":
        return {
          card:
            "border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:border-amber-900/60 dark:from-amber-950/30 dark:via-[#15151d] dark:to-yellow-950/20",
          icon:
            "border-amber-200 bg-amber-100 text-amber-600 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-400",
          category:
            "border-amber-200 bg-amber-100/80 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
        };

      case "danger":
        return {
          card:
            "border-red-200/80 bg-gradient-to-br from-red-50 via-white to-rose-50 dark:border-red-900/60 dark:from-red-950/30 dark:via-[#15151d] dark:to-rose-950/20",
          icon:
            "border-red-200 bg-red-100 text-red-600 dark:border-red-800 dark:bg-red-950/60 dark:text-red-400",
          category:
            "border-red-200 bg-red-100/80 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400",
        };

      case "achievement":
        return {
          card:
            "border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:border-violet-900/60 dark:from-violet-950/30 dark:via-[#15151d] dark:to-purple-950/20",
          icon:
            "border-violet-200 bg-violet-100 text-violet-600 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-400",
          category:
            "border-violet-200 bg-violet-100/80 text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400",
        };

      default:
        return {
          card:
            "border-indigo-200/80 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:border-indigo-900/60 dark:from-indigo-950/30 dark:via-[#15151d] dark:to-purple-950/20",
          icon:
            "border-indigo-200 bg-indigo-100 text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-400",
          category:
            "border-indigo-200 bg-indigo-100/80 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400",
        };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400";

      case "medium":
        return "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-400";

      case "low":
        return "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400";

      default:
        return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400";
    }
  };

  const spendingPercentage = getSpendingPercentage();

  return (
    <div className="min-h-full w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
              Financial Overview
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Insights
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Understand what your financial activity is telling you.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchInsights}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-500/30"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm dark:border-red-900/60 dark:from-red-950/30 dark:to-rose-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          /* Loading */
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-slate-200/80 bg-white/70 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-[#15151d]/70">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                <RefreshCw
                  size={22}
                  className="animate-spin"
                />
              </div>

              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Loading insights...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Financial Overview */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* Income */}
              <div className="group relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 shadow-lg shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-emerald-900/60 dark:from-emerald-950/35 dark:via-[#15151d] dark:to-green-950/20">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Total Income
                    </p>

                    <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {formatCurrency(data.totalIncome)}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Total recorded income
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-100 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <TrendingUp size={21} />
                  </div>
                </div>
              </div>

              {/* Expense */}
              <div className="group relative overflow-hidden rounded-3xl border border-red-200/70 bg-gradient-to-br from-red-50 via-white to-rose-50 p-5 shadow-lg shadow-red-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-red-900/60 dark:from-red-950/35 dark:via-[#15151d] dark:to-rose-950/20">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-red-400/10 blur-2xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400">
                      Total Expense
                    </p>

                    <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {formatCurrency(data.totalExpense)}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Total recorded spending
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-100 text-red-600 dark:border-red-800 dark:bg-red-950/60 dark:text-red-400">
                    <TrendingDown size={21} />
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="group relative overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-purple-50 p-5 shadow-lg shadow-violet-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-violet-900/60 dark:from-violet-950/35 dark:via-[#15151d] dark:to-purple-950/20">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-400/10 blur-2xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                      Balance
                    </p>

                    <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {formatCurrency(data.balance)}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Income minus expenses
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-200 bg-violet-100 text-violet-600 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-400">
                    <Wallet size={21} />
                  </div>
                </div>
              </div>
            </div>

            {/* Spending Overview */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/75 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-[#15151d]/75 sm:p-6">
              <div className="flex flex-col gap-5">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">
                      Spending Analysis
                    </p>

                    <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                      Spending Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      How much of your income has been spent.
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {spendingPercentage.toFixed(1)}
                    </span>

                    <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                      %
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="h-4 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 shadow-sm transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        spendingPercentage,
                        100
                      )}%`,
                    }}
                  />
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="rounded-2xl border border-red-100 bg-red-50/70 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/20">
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      Spent{" "}
                    </span>

                    <strong className="font-extrabold text-red-600 dark:text-red-400">
                      {formatCurrency(data.totalExpense)}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      Income{" "}
                    </span>

                    <strong className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(data.totalIncome)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights Section Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">
                  Personalized Analysis
                </p>

                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Your Insights
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {data.count}{" "}
                  {data.count === 1 ? "insight" : "insights"} generated from
                  your financial activity.
                </p>
              </div>

              <div className="w-fit rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-400">
                {data.count} Total
              </div>
            </div>

            {/* Insights List */}
            {data.insights.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {data.insights.map((insight, index) => {
                  const styles = getInsightCardStyle(insight.type);

                  return (
                    <div
                      className={`group relative overflow-hidden rounded-3xl border p-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 ${styles.card}`}
                      key={`${insight.category}-${index}`}
                    >
                      {/* Decorative blur */}
                      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/40 blur-3xl dark:bg-white/5" />

                      {/* Top */}
                      <div className="relative flex items-start gap-4">

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${styles.icon}`}
                        >
                          {getInsightIcon(insight.type)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-extrabold capitalize ${styles.category}`}
                            >
                              {getCategoryIcon(insight.category)}

                              <span>
                                {insight.category}
                              </span>
                            </div>

                            <span
                              className={`rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider ${getPriorityStyle(
                                insight.priority
                              )}`}
                            >
                              {insight.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative mt-5">
                        <h3 className="text-lg font-extrabold leading-snug text-slate-900 dark:text-white">
                          {insight.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {insight.message}
                        </p>

                        {insight.punchline && (
                          <div className="mt-4 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-sm font-bold leading-6 text-slate-700 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/30 dark:text-slate-200">
                            {insight.punchline}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-3xl border border-slate-200/80 bg-white/75 px-6 py-12 text-center shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-[#15151d]/75">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-violet-100 text-violet-600 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400">
                  <Lightbulb size={25} />
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">
                  No insights available yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Add more financial activity to generate personalized
                  insights.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Insights;