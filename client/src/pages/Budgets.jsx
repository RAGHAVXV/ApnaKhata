import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Wallet,
  AlertTriangle,
  CheckCircle,
  CircleAlert,
  ChevronDown,
  Check,
  CalendarDays,
  Target,
  Clock3,
} from "lucide-react";
import api from "../services/api";

/* =========================================================
   Reusable glass dropdown
   Used everywhere on this page instead of native <select>.
========================================================= */
function GlassDropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
  icon: Icon,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  return (
    <div ref={ref} className="relative z-30">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className={[
          "flex w-full items-center justify-between gap-3 rounded-2xl",
          "border border-slate-200/90 bg-gradient-to-br from-white via-white/90 to-purple-50/80",
          "px-4 py-3.5 text-left shadow-[0_8px_25px_-18px_rgba(80,50,160,0.45)]",
          "backdrop-blur-xl transition-all duration-300",
          "hover:border-purple-300 hover:shadow-[0_12px_28px_-18px_rgba(124,58,237,0.45)]",
          "focus:outline-none focus:ring-2 focus:ring-purple-300/50",
          "dark:border-white/10 dark:from-white/[0.08] dark:via-white/[0.05] dark:to-purple-500/[0.08]",
          open
            ? "border-purple-400/80 ring-2 ring-purple-300/25 shadow-[0_12px_30px_-18px_rgba(124,58,237,0.6)]"
            : "",
        ].join(" ")}
      >
        <span className="flex min-w-0 items-center gap-3">
          {Icon && (
            <Icon
              size={18}
              className="shrink-0 text-purple-600 dark:text-purple-300"
            />
          )}

          <span
            className={
              selectedOption
                ? "truncate text-sm font-bold text-slate-800 dark:text-slate-100"
                : "truncate text-sm font-bold text-slate-400 dark:text-slate-400"
            }
          >
            {selectedOption?.label || placeholder}
          </span>
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-500 transition-transform duration-300 ${
            open ? "rotate-180 text-purple-600 dark:text-purple-300" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] overflow-hidden rounded-2xl border border-purple-200/80 bg-white/85 p-1.5 shadow-[0_22px_55px_-22px_rgba(60,35,130,0.5)] backdrop-blur-2xl dark:border-white/15 dark:bg-[#181722]/90">
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => {
              const active = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-3",
                    "text-left text-sm font-bold transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-purple-100 via-purple-50 to-white text-purple-700 shadow-sm dark:from-purple-500/20 dark:via-purple-500/10 dark:to-white/[0.04] dark:text-purple-200"
                      : "text-slate-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-white dark:text-slate-200 dark:hover:from-purple-500/10 dark:hover:to-white/[0.04]",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    {option.icon && (
                      <option.icon
                        size={17}
                        className={
                          active
                            ? "text-purple-600 dark:text-purple-300"
                            : "text-slate-500 dark:text-slate-400"
                        }
                      />
                    )}
                    {option.label}
                  </span>

                  {active && (
                    <Check
                      size={17}
                      className="text-purple-600 dark:text-purple-300"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    scope: "overall",
    category: "",
    amount: "",
    period: "monthly",
    startDate: "",
    endDate: "",
    warningThreshold: 80,
  });

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/budgets");

      setBudgets(response.data.budgets || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load budgets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      scope: "overall",
      category: "",
      amount: "",
      period: "monthly",
      startDate: "",
      endDate: "",
      warningThreshold: 80,
    });

    setEditingBudget(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEditForm = (budget) => {
    setEditingBudget(budget);

    setFormData({
      name: budget.name || "",
      scope: budget.scope || "overall",
      category: budget.category || "",
      amount: budget.amount || "",
      period: budget.period || "monthly",
      startDate: budget.startDate
        ? new Date(budget.startDate).toISOString().split("T")[0]
        : "",
      endDate: budget.endDate
        ? new Date(budget.endDate).toISOString().split("T")[0]
        : "",
      warningThreshold: budget.warningThreshold || 80,
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

  const handleDropdownChange = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Budget name is required.";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      return "Budget amount must be greater than zero.";
    }

    if (!formData.startDate) {
      return "Start date is required.";
    }

    if (!formData.endDate) {
      return "End date is required.";
    }

    if (
      new Date(formData.startDate) >
      new Date(formData.endDate)
    ) {
      return "End date must be after start date.";
    }

    if (
      formData.scope === "category" &&
      !formData.category.trim()
    ) {
      return "Category is required for a category budget.";
    }

    if (
      Number(formData.warningThreshold) < 1 ||
      Number(formData.warningThreshold) > 100
    ) {
      return "Warning threshold must be between 1 and 100.";
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
        name: formData.name.trim(),
        scope: formData.scope,
        category:
          formData.scope === "category"
            ? formData.category.trim()
            : null,
        amount: Number(formData.amount),
        period: formData.period,
        startDate: formData.startDate,
        endDate: formData.endDate,
        warningThreshold: Number(formData.warningThreshold),
      };

      if (editingBudget) {
        await api.put(
          `/budgets/${editingBudget._id}`,
          payload
        );

        setSuccess("Budget updated successfully.");
      } else {
        await api.post("/budgets", payload);

        setSuccess("Budget created successfully.");
      }

      setShowForm(false);
      resetForm();

      await fetchBudgets();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save budget."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (budget) => {
    const confirmed = window.confirm(
      `Delete "${budget.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(`/budgets/${budget._id}`);

      setSuccess("Budget deleted successfully.");

      await fetchBudgets();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete budget."
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

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusLabel = (status) => {
    if (status === "exceeded") {
      return "Exceeded";
    }

    if (status === "warning") {
      return "Warning";
    }

    return "On Track";
  };

  const getStatusIcon = (status) => {
    if (status === "exceeded") {
      return <CircleAlert size={18} />;
    }

    if (status === "warning") {
      return <AlertTriangle size={18} />;
    }

    return <CheckCircle size={18} />;
  };

  const getPercentage = (percentage) => {
    return Math.min(
      Math.max(Number(percentage) || 0, 0),
      100
    );
  };

  const totalBudget = budgets.reduce(
    (total, budget) =>
      total + Number(budget.amount || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (total, budget) =>
      total + Number(budget.spent || 0),
    0
  );

  const totalRemaining = budgets.reduce(
    (total, budget) =>
      total + Number(budget.remaining || 0),
    0
  );

  const scopeOptions = [
    {
      value: "overall",
      label: "Overall",
      icon: Wallet,
    },
    {
      value: "category",
      label: "Category",
      icon: Target,
    },
  ];

  const periodOptions = [
    {
      value: "weekly",
      label: "Weekly",
      icon: Clock3,
    },
    {
      value: "monthly",
      label: "Monthly",
      icon: CalendarDays,
    },
    {
      value: "custom",
      label: "Custom",
      icon: Target,
    },
  ];

  return (
    <div className="min-h-full w-full space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <section className="flex flex-col gap-5 rounded-[28px] border border-purple-200/60 bg-gradient-to-br from-white via-white/90 to-purple-50/80 p-6 shadow-[0_18px_45px_-30px_rgba(80,50,160,0.35)] backdrop-blur-xl dark:border-white/10 dark:from-white/[0.06] dark:via-white/[0.04] dark:to-purple-500/[0.08] sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.22em] text-purple-600 dark:text-purple-300">
            MONEY PLAN
          </span>

          <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
            Budgets
          </h1>

          <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300 sm:text-base">
            Plan your spending and keep your expenses under control.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-400/30 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_30px_-14px_rgba(124,58,237,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-14px_rgba(124,58,237,0.9)] active:translate-y-0"
        >
          <Plus size={19} />
          Add Budget
        </button>
      </section>

      {/* =====================================================
          MESSAGES
      ===================================================== */}
      {error && (
        <div className="rounded-2xl border border-red-200/80 bg-gradient-to-r from-red-50/95 via-white/90 to-rose-50/90 px-5 py-4 text-sm font-extrabold text-red-700 shadow-sm backdrop-blur-xl dark:border-red-400/20 dark:from-red-500/10 dark:via-white/[0.04] dark:to-rose-500/10 dark:text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/95 via-white/90 to-green-50/90 px-5 py-4 text-sm font-extrabold text-emerald-700 shadow-sm backdrop-blur-xl dark:border-emerald-400/20 dark:from-emerald-500/10 dark:via-white/[0.04] dark:to-green-500/10 dark:text-emerald-200">
          {success}
        </div>
      )}

      {/* =====================================================
          SUMMARY
      ===================================================== */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-[26px] border border-purple-200/80 bg-gradient-to-br from-purple-100/80 via-white/90 to-violet-50/70 p-5 shadow-[0_18px_40px_-28px_rgba(124,58,237,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 dark:border-purple-300/15 dark:from-purple-500/15 dark:via-white/[0.04] dark:to-violet-500/10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-300/60 bg-purple-100/80 text-purple-600 dark:border-purple-300/20 dark:bg-purple-500/15 dark:text-purple-300">
              <Wallet size={22} />
            </div>

            <div>
              <span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-purple-700 dark:text-purple-300">
                Total Budget
              </span>
              <strong className="mt-1 block text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {formatCurrency(totalBudget)}
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-red-200/80 bg-gradient-to-br from-red-100/75 via-white/90 to-rose-50/70 p-5 shadow-[0_18px_40px_-28px_rgba(220,80,90,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 dark:border-red-300/15 dark:from-red-500/15 dark:via-white/[0.04] dark:to-rose-500/10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-300/60 bg-red-100/80 text-red-600 dark:border-red-300/20 dark:bg-red-500/15 dark:text-red-300">
              <Wallet size={22} />
            </div>

            <div>
              <span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-red-700 dark:text-red-300">
                Total Spent
              </span>
              <strong className="mt-1 block text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {formatCurrency(totalSpent)}
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-emerald-200/80 bg-gradient-to-br from-emerald-100/75 via-white/90 to-green-50/70 p-5 shadow-[0_18px_40px_-28px_rgba(30,150,100,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 dark:border-emerald-300/15 dark:from-emerald-500/15 dark:via-white/[0.04] dark:to-green-500/10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/60 bg-emerald-100/80 text-emerald-600 dark:border-emerald-300/20 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Wallet size={22} />
            </div>

            <div>
              <span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                Remaining
              </span>
              <strong className="mt-1 block text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {formatCurrency(totalRemaining)}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      {loading ? (
        <div className="rounded-[28px] border border-slate-200/80 bg-white/75 p-12 text-center text-sm font-extrabold text-slate-600 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
          Loading budgets...
        </div>
      ) : budgets.length === 0 ? (
        <div className="rounded-[30px] border border-purple-200/70 bg-gradient-to-br from-white via-purple-50/60 to-white p-10 text-center shadow-[0_22px_55px_-35px_rgba(100,70,180,0.4)] backdrop-blur-xl dark:border-white/10 dark:from-white/[0.06] dark:via-purple-500/[0.08] dark:to-white/[0.03] sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-purple-200 bg-purple-50 text-purple-600 shadow-sm dark:border-purple-300/20 dark:bg-purple-500/10 dark:text-purple-300">
            <Wallet size={32} />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            No budgets yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm font-bold text-slate-600 dark:text-slate-300">
            Create your first budget to start tracking your spending.
          </p>

          <button
            type="button"
            onClick={openAddForm}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_30px_-14px_rgba(124,58,237,0.8)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Create Budget
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {budgets.map((budget) => {
            const percentage = getPercentage(
              budget.percentageUsed
            );

            const statusStyles =
              budget.status === "exceeded"
                ? "border-red-200/80 from-red-50/90 via-white/90 to-rose-50/80 dark:border-red-300/15 dark:from-red-500/[0.12] dark:via-white/[0.04] dark:to-rose-500/[0.08]"
                : budget.status === "warning"
                ? "border-amber-200/80 from-amber-50/90 via-white/90 to-yellow-50/80 dark:border-amber-300/15 dark:from-amber-500/[0.12] dark:via-white/[0.04] dark:to-yellow-500/[0.08]"
                : "border-emerald-200/80 from-emerald-50/90 via-white/90 to-green-50/80 dark:border-emerald-300/15 dark:from-emerald-500/[0.12] dark:via-white/[0.04] dark:to-green-500/[0.08]";

            return (
              <article
                className={`rounded-[30px] border bg-gradient-to-br p-6 shadow-[0_20px_50px_-32px_rgba(50,40,100,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_55px_-32px_rgba(70,50,130,0.45)] ${statusStyles}`}
                key={budget._id}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                      {budget.name}
                    </h2>

                    <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
                      {budget.scope === "category"
                        ? `Category: ${budget.category}`
                        : "Overall Budget"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(budget)}
                      title="Edit budget"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white/75 text-slate-600 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(budget)}
                      title="Delete budget"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200/80 bg-red-50/60 text-red-600 shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-red-100 dark:border-red-300/15 dark:bg-red-500/[0.08] dark:text-red-300 dark:hover:bg-red-500/15"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Amounts */}
                <div className="mt-7 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-red-200/70 bg-gradient-to-br from-red-50/90 to-white/80 p-4 dark:border-red-300/15 dark:from-red-500/10 dark:to-white/[0.04]">
                    <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-red-700 dark:text-red-300">
                      Spent
                    </span>

                    <strong className="mt-1 block text-xl font-extrabold text-slate-950 dark:text-white">
                      {formatCurrency(budget.spent)}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-purple-200/70 bg-gradient-to-br from-purple-50/90 to-white/80 p-4 dark:border-purple-300/15 dark:from-purple-500/10 dark:to-white/[0.04]">
                    <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-purple-700 dark:text-purple-300">
                      Budget
                    </span>

                    <strong className="mt-1 block text-xl font-extrabold text-slate-950 dark:text-white">
                      {formatCurrency(budget.amount)}
                    </strong>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                      {percentage.toFixed(0)}% used
                    </span>

                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                      {formatCurrency(budget.remaining)} remaining
                    </span>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        budget.status === "exceeded"
                          ? "bg-gradient-to-r from-red-400 to-red-600"
                          : budget.status === "warning"
                          ? "bg-gradient-to-r from-amber-400 to-orange-500"
                          : "bg-gradient-to-r from-emerald-400 to-green-600"
                      }`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-3.5 dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Period
                    </span>
                    <strong className="mt-1 block text-sm font-extrabold capitalize text-slate-900 dark:text-white">
                      {budget.period}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-3.5 dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Ends
                    </span>
                    <strong className="mt-1 block text-sm font-extrabold text-slate-900 dark:text-white">
                      {formatDate(budget.endDate)}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-3.5 dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Days Left
                    </span>
                    <strong className="mt-1 block text-sm font-extrabold text-slate-900 dark:text-white">
                      {budget.daysRemaining}
                    </strong>
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`mt-5 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-extrabold ${
                    budget.status === "exceeded"
                      ? "border-red-200/80 bg-red-50/70 text-red-700 dark:border-red-300/15 dark:bg-red-500/[0.08] dark:text-red-300"
                      : budget.status === "warning"
                      ? "border-amber-200/80 bg-amber-50/70 text-amber-700 dark:border-amber-300/15 dark:bg-amber-500/[0.08] dark:text-amber-300"
                      : "border-emerald-200/80 bg-emerald-50/70 text-emerald-700 dark:border-emerald-300/15 dark:bg-emerald-500/[0.08] dark:text-emerald-300"
                  }`}
                >
                  {getStatusIcon(budget.status)}
                  <span>{getStatusLabel(budget.status)}</span>
                </div>

                {/* Insight */}
                {budget.insight && (
                  <div className="mt-5 rounded-2xl border border-purple-200/70 bg-gradient-to-br from-purple-50/80 via-white/65 to-violet-50/70 p-4 backdrop-blur-xl dark:border-purple-300/15 dark:from-purple-500/[0.10] dark:via-white/[0.03] dark:to-violet-500/[0.08]">
                    {budget.insight.title && (
                      <strong className="block text-sm font-extrabold text-purple-800 dark:text-purple-200">
                        {budget.insight.title}
                      </strong>
                    )}

                    {budget.insight.message && (
                      <p className="mt-1 text-sm font-bold leading-6 text-slate-700 dark:text-slate-300">
                        {budget.insight.message}
                      </p>
                    )}

                    {budget.insight.punchline && (
                      <span className="mt-2 block text-xs font-extrabold text-purple-700 dark:text-purple-300">
                        {budget.insight.punchline}
                      </span>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
          Starts below the 90px topbar so it never touches it.
      ===================================================== */}
      {showForm && (
        <div
          className="fixed inset-x-0 bottom-0 top-[90px] z-[200] flex items-center justify-center overflow-y-auto bg-slate-950/20 px-4 py-6 backdrop-blur-[5px] transition-all duration-500 dark:bg-black/35 sm:px-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeForm();
            }
          }}
        >
          <div
            className="my-auto w-full max-w-[540px] overflow-visible rounded-[30px] border border-white/80 bg-gradient-to-br from-white/90 via-white/80 to-purple-50/85 shadow-[0_30px_80px_-28px_rgba(55,35,120,0.55)] backdrop-blur-2xl transition-all duration-700 ease-out dark:border-white/15 dark:from-[#181822]/90 dark:via-[#171720]/85 dark:to-purple-950/35"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-5 border-b border-slate-200/70 px-6 py-5 dark:border-white/10 sm:px-7">
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-[0.22em] text-purple-600 dark:text-purple-300">
                  {editingBudget ? "UPDATE PLAN" : "NEW PLAN"}
                </span>

                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                  {editingBudget ? "Edit Budget" : "Create Budget"}
                </h2>

                <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
                  Set your spending limit and tracking period.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 text-slate-600 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6 sm:px-7"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="budget-name"
                  className="mb-2 block text-sm font-extrabold text-slate-800 dark:text-slate-100"
                >
                  Budget Name
                </label>

                <input
                  id="budget-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Monthly Expenses"
                  className="w-full rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white/90 to-purple-50/60 px-4 py-3.5 text-sm font-bold text-slate-900 shadow-sm outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-300/30 dark:border-white/10 dark:from-white/[0.08] dark:via-white/[0.05] dark:to-purple-500/[0.08] dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {/* Scope */}
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800 dark:text-slate-100">
                  Budget Type
                </label>

                <GlassDropdown
                  value={formData.scope}
                  onChange={(value) =>
                    handleDropdownChange("scope", value)
                  }
                  options={scopeOptions}
                  icon={Wallet}
                />
              </div>

              {/* Category */}
              {formData.scope === "category" && (
                <div>
                  <label
                    htmlFor="budget-category"
                    className="mb-2 block text-sm font-extrabold text-slate-800 dark:text-slate-100"
                  >
                    Category
                  </label>

                  <input
                    id="budget-category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Food"
                    className="w-full rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white/90 to-purple-50/60 px-4 py-3.5 text-sm font-bold text-slate-900 shadow-sm outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-300/30 dark:border-white/10 dark:from-white/[0.08] dark:via-white/[0.05] dark:to-purple-500/[0.08] dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              )}

              {/* Amount */}
              <div>
                <label
                  htmlFor="budget-amount"
                  className="mb-2 block text-sm font-extrabold text-slate-800 dark:text-slate-100"
                >
                  Budget Amount
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-extrabold text-purple-600 dark:text-purple-300">
                    ₹
                  </span>

                  <input
                    id="budget-amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="10000"
                    className="w-full rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/80 via-white/90 to-violet-50/70 py-3.5 pl-10 pr-4 text-sm font-extrabold text-slate-900 shadow-sm outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-300/30 dark:border-purple-300/15 dark:from-purple-500/[0.10] dark:via-white/[0.05] dark:to-violet-500/[0.08] dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Period */}
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800 dark:text-slate-100">
                  Period
                </label>

                <GlassDropdown
                  value={formData.period}
                  onChange={(value) =>
                    handleDropdownChange("period", value)
                  }
                  options={periodOptions}
                  icon={CalendarDays}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="budget-start-date"
                    className="mb-2 block text-sm font-extrabold text-slate-800 dark:text-slate-100"
                  >
                    Start Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-300"
                    />

                    <input
                      id="budget-start-date"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white/90 to-purple-50/60 py-3.5 pl-11 pr-3 text-sm font-bold text-slate-900 shadow-sm outline-none backdrop-blur-xl transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-300/30 dark:border-white/10 dark:from-white/[0.08] dark:via-white/[0.05] dark:to-purple-500/[0.08] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="budget-end-date"
                    className="mb-2 block text-sm font-extrabold text-slate-800 dark:text-slate-100"
                  >
                    End Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-300"
                    />

                    <input
                      id="budget-end-date"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white/90 to-purple-50/60 py-3.5 pl-11 pr-3 text-sm font-bold text-slate-900 shadow-sm outline-none backdrop-blur-xl transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-300/30 dark:border-white/10 dark:from-white/[0.08] dark:via-white/[0.05] dark:to-purple-500/[0.08] dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Warning threshold */}
              <div>
                <label
                  htmlFor="budget-warning"
                  className="mb-2 block text-sm font-extrabold text-slate-800 dark:text-slate-100"
                >
                  Warning Threshold (%)
                </label>

                <div className="relative">
                  <input
                    id="budget-warning"
                    name="warningThreshold"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.warningThreshold}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white/90 to-yellow-50/70 px-4 py-3.5 pr-12 text-sm font-extrabold text-slate-900 shadow-sm outline-none backdrop-blur-xl transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 dark:border-amber-300/15 dark:from-amber-500/[0.10] dark:via-white/[0.05] dark:to-yellow-500/[0.08] dark:text-white"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-amber-600 dark:text-amber-300">
                    %
                  </span>
                </div>

                <small className="mt-2 block text-xs font-bold leading-5 text-slate-500 dark:text-slate-400">
                  Warning will appear when spending reaches this percentage.
                </small>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200/70 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="rounded-2xl border border-slate-200/90 bg-white/70 px-5 py-3.5 text-sm font-extrabold text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-purple-500/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl border border-purple-400/30 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_30px_-14px_rgba(124,58,237,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-14px_rgba(124,58,237,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : editingBudget
                    ? "Update Budget"
                    : "Create Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;
