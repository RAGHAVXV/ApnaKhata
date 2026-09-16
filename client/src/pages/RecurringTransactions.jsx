import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Repeat,
  CalendarDays,
  CheckCircle,
  Clock,
  AlertTriangle,
  SkipForward,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2,
} from "lucide-react";
import api from "../services/api";

function RecurringTransactions() {
  const [recurringTransactions, setRecurringTransactions] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // null = creating
  // transaction object = editing
  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    frequency: "monthly",
    startDate: "",
    nextDueDate: "",
  });

  const fetchRecurringTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/recurring-transactions"
      );

      setRecurringTransactions(
        response.data.recurringTransactions || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load recurring transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const resetForm = () => {
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      frequency: "monthly",
      startDate: "",
      nextDueDate: "",
    });

    setEditingTransaction(null);
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEditForm = (transaction) => {
    setEditingTransaction(transaction);

    setFormData({
      type: transaction.type || "expense",
      amount: transaction.amount ?? "",
      category: transaction.category || "",
      description: transaction.description || "",
      frequency: transaction.frequency || "monthly",
      startDate: transaction.startDate
        ? new Date(transaction.startDate)
            .toISOString()
            .split("T")[0]
        : "",
      nextDueDate: transaction.nextDueDate
        ? new Date(transaction.nextDueDate)
            .toISOString()
            .split("T")[0]
        : "",
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const closeForm = () => {
    if (submitting) {
      return;
    }

    setShowForm(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.amount ||
      Number(formData.amount) <= 0
    ) {
      return "Amount must be greater than zero.";
    }

    if (!formData.category.trim()) {
      return "Category is required.";
    }

    if (!formData.frequency) {
      return "Frequency is required.";
    }

    if (!formData.nextDueDate) {
      return "Next due date is required.";
    }

    if (
      formData.startDate &&
      new Date(formData.startDate) >
        new Date(formData.nextDueDate)
    ) {
      return "Next due date must be on or after the start date.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        type: formData.type,
        amount: Number(formData.amount),
        category: formData.category.trim(),
        description: formData.description.trim(),
        frequency: formData.frequency,
        startDate:
          formData.startDate || undefined,
        nextDueDate: formData.nextDueDate,
      };

      if (editingTransaction) {
        await api.put(
          `/recurring-transactions/${editingTransaction._id}`,
          payload
        );

        setSuccess(
          "Recurring transaction updated successfully."
        );
      } else {
        await api.post(
          "/recurring-transactions",
          payload
        );

        setSuccess(
          "Recurring transaction created successfully."
        );
      }

      setShowForm(false);
      resetForm();

      await fetchRecurringTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingTransaction
            ? "Failed to update recurring transaction."
            : "Failed to create recurring transaction.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async (transaction) => {
    const confirmed = window.confirm(
      `Mark ${formatCurrency(transaction.amount)} as paid?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.post(
        `/recurring-transactions/${transaction._id}/pay`
      );

      setSuccess(
        "Recurring transaction marked as paid."
      );

      await fetchRecurringTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to mark transaction as paid."
      );
    }
  };

  const handleSkip = async (transaction) => {
    const confirmed = window.confirm(
      "Skip this recurring transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.post(
        `/recurring-transactions/${transaction._id}/skip`
      );

      setSuccess(
        "Recurring transaction skipped."
      );

      await fetchRecurringTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to skip recurring transaction."
      );
    }
  };

  const handleDelete = async (transaction) => {
    const confirmed = window.confirm(
      `Delete "${transaction.category}" recurring transaction? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/recurring-transactions/${transaction._id}`
      );

      setSuccess(
        "Recurring transaction deleted successfully."
      );

      await fetchRecurringTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete recurring transaction."
      );
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "due":
        return <Clock size={16} />;

      case "overdue":
        return <AlertTriangle size={16} />;

      case "completed":
        return <CheckCircle size={16} />;

      case "skipped":
        return <SkipForward size={16} />;

      default:
        return <CalendarDays size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "due":
        return "Due";

      case "overdue":
        return "Overdue";

      case "completed":
        return "Completed";

      case "skipped":
        return "Skipped";

      default:
        return "Upcoming";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "due":
        return {
          badge:
            "border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400",
          icon:
            "text-violet-600 dark:text-violet-400",
        };

      case "overdue":
        return {
          badge:
            "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400",
          icon:
            "text-red-600 dark:text-red-400",
        };

      case "completed":
        return {
          badge:
            "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
          icon:
            "text-emerald-600 dark:text-emerald-400",
        };

      case "skipped":
        return {
          badge:
            "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400",
          icon:
            "text-slate-500 dark:text-slate-400",
        };

      default:
        return {
          badge:
            "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400",
          icon:
            "text-blue-600 dark:text-blue-400",
        };
    }
  };

  const getCardStyle = (type) => {
    if (type === "income") {
      return {
        card:
          "border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:border-emerald-900/60 dark:from-emerald-950/30 dark:via-[#15151d] dark:to-green-950/20",
        icon:
          "border-emerald-200 bg-emerald-100 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400",
        type:
          "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
        amount:
          "text-emerald-600 dark:text-emerald-400",
      };
    }

    return {
      card:
        "border-red-200/80 bg-gradient-to-br from-red-50 via-white to-rose-50 dark:border-red-900/60 dark:from-red-950/30 dark:via-[#15151d] dark:to-rose-950/20",
      icon:
        "border-red-200 bg-red-100 text-red-600 dark:border-red-800 dark:bg-red-950/60 dark:text-red-400",
      type:
        "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400",
      amount:
        "text-red-600 dark:text-red-400",
    };
  };

  return (
    <div className="min-h-full w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
              Automated Transactions
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Recurring Transactions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Manage income and expenses that happen regularly.
            </p>
          </div>

          <button
            type="button"
            onClick={openForm}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/25 dark:border-violet-500/30"
          >
            <Plus size={18} />
            Add Recurring
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm dark:border-red-900/60 dark:from-red-950/30 dark:to-rose-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-4 text-sm font-semibold text-emerald-700 shadow-sm dark:border-emerald-900/60 dark:from-emerald-950/30 dark:to-green-950/20 dark:text-emerald-400">
            {success}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-slate-200/80 bg-white/70 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-[#15151d]/70">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                <RefreshCw
                  size={22}
                  className="animate-spin"
                />
              </div>

              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Loading recurring transactions...
              </p>
            </div>
          </div>
        ) : recurringTransactions.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-slate-200/80 bg-white/75 px-6 py-14 text-center shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-[#15151d]/75">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-200 bg-violet-100 text-violet-600 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400">
              <Repeat size={28} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white">
              No recurring transactions
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Add rent, subscriptions, salary, bills, or any other repeated transaction.
            </p>

            <button
              type="button"
              onClick={openForm}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-violet-500/30"
            >
              <Plus size={18} />
              Add Recurring
            </button>
          </div>
        ) : (
          /* Recurring Transactions */
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {recurringTransactions.map((transaction) => {
              const cardStyle = getCardStyle(
                transaction.type
              );

              const statusStyle = getStatusStyle(
                transaction.status
              );

              return (
                <div
                  key={transaction._id}
                  className={`group relative overflow-hidden rounded-3xl border p-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 ${cardStyle.card}`}
                >
                  {/* Decorative glow */}
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/40 blur-3xl dark:bg-white/5" />

                  {/* Header */}
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${cardStyle.icon}`}
                      >
                        <Repeat size={21} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-extrabold text-slate-900 dark:text-white">
                          {transaction.category}
                        </h2>

                        <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                          {transaction.description ||
                            "Recurring transaction"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider ${cardStyle.type}`}
                    >
                      {transaction.type}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="relative mt-6 rounded-2xl border border-white/70 bg-white/55 p-4 dark:border-slate-700/70 dark:bg-slate-900/25">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Amount
                        </p>

                        <p
                          className={`mt-1 text-2xl font-extrabold tracking-tight ${cardStyle.amount}`}
                        >
                          {transaction.type === "expense"
                            ? "-"
                            : "+"}
                          {formatCurrency(
                            transaction.amount
                          )}
                        </p>
                      </div>

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${cardStyle.icon}`}
                      >
                        {transaction.type ===
                        "expense" ? (
                          <ArrowDownRight size={19} />
                        ) : (
                          <ArrowUpRight size={19} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="relative mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-3 dark:border-slate-700/70 dark:bg-slate-900/25">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Frequency
                      </p>

                      <p className="mt-1 text-sm font-bold capitalize text-slate-800 dark:text-slate-200">
                        {transaction.frequency}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-3 dark:border-slate-700/70 dark:bg-slate-900/25">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Next Due
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                        {formatDate(
                          transaction.nextDueDate
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-3 dark:border-slate-700/70 dark:bg-slate-900/25">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Last Completed
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                        {transaction.lastCompletedDate
                          ? formatDate(
                              transaction.lastCompletedDate
                            )
                          : "Not yet"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="relative mt-4">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-extrabold ${statusStyle.badge}`}
                    >
                      <span className={statusStyle.icon}>
                        {getStatusIcon(
                          transaction.status
                        )}
                      </span>

                      {getStatusLabel(
                        transaction.status
                      )}
                    </div>
                  </div>

                  {/* Payment Actions */}
                  {transaction.isActive && (
                    <div className="relative mt-5 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          handlePay(transaction)
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm font-extrabold text-emerald-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-200 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-950/80"
                      >
                        <CheckCircle size={17} />
                        Mark Paid
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSkip(transaction)
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-extrabold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <SkipForward size={17} />
                        Skip
                      </button>
                    </div>
                  )}

                  {/* Edit / Delete */}
                  <div className="relative mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(transaction)
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-extrabold text-violet-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-400 dark:hover:bg-violet-950/70"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(transaction)
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-extrabold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add / Edit Modal */}
        {showForm && (
          <div
            className="fixed inset-x-0 bottom-0 top-[115px] z-50 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-4 py-6 backdrop-blur-sm sm:px-6"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeForm();
              }
            }}
          >
            <div className="w-full max-w-xl animate-[modalIn_0.45s_ease-out] overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl dark:border-slate-700 dark:bg-[#15151d]/95">

              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 bg-gradient-to-r from-violet-50 to-purple-50 px-5 py-5 dark:border-slate-800 dark:from-violet-950/30 dark:to-purple-950/20 sm:px-6">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
                    Automated Schedule
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                    {editingTransaction
                      ? "Edit Recurring Transaction"
                      : "Add Recurring Transaction"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {editingTransaction
                      ? "Update the details of this recurring transaction."
                      : "Set up a transaction that happens repeatedly."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form
                className="max-h-[calc(100vh-230px)] overflow-y-auto px-5 py-5 sm:px-6"
                onSubmit={handleSubmit}
              >
                <div className="space-y-5">

                  {/* Type */}
                  <div>
                    <label
                      htmlFor="recurring-type"
                      className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                    >
                      Type
                    </label>

                    <select
                      id="recurring-type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:border-violet-500 dark:focus:bg-slate-900"
                    >
                      <option value="expense">
                        Expense
                      </option>

                      <option value="income">
                        Income
                      </option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label
                      htmlFor="recurring-amount"
                      className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                    >
                      Amount
                    </label>

                    <input
                      id="recurring-amount"
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="e.g. 12000"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-violet-500 dark:focus:bg-slate-900"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="recurring-category"
                      className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                    >
                      Category
                    </label>

                    <input
                      id="recurring-category"
                      name="category"
                      type="text"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g. Rent"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-violet-500 dark:focus:bg-slate-900"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="recurring-description"
                      className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                    >
                      Description
                    </label>

                    <input
                      id="recurring-description"
                      name="description"
                      type="text"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="e.g. Monthly house rent"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-violet-500 dark:focus:bg-slate-900"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label
                      htmlFor="recurring-frequency"
                      className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                    >
                      Frequency
                    </label>

                    <select
                      id="recurring-frequency"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:border-violet-500 dark:focus:bg-slate-900"
                    >
                      <option value="weekly">
                        Weekly
                      </option>

                      <option value="monthly">
                        Monthly
                      </option>

                      <option value="yearly">
                        Yearly
                      </option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="recurring-start"
                        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                      >
                        Start Date
                      </label>

                      <input
                        id="recurring-start"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:border-violet-500 dark:focus:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="recurring-next-due"
                        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                      >
                        Next Due Date
                      </label>

                      <input
                        id="recurring-next-due"
                        name="nextDueDate"
                        type="date"
                        value={formData.nextDueDate}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:border-violet-500 dark:focus:bg-slate-900"
                      />
                    </div>

                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={submitting}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-600 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-500/30"
                  >
                    {submitting && (
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                    )}

                    {submitting
                      ? "Saving..."
                      : editingTransaction
                      ? "Save Changes"
                      : "Create Recurring"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default RecurringTransactions;