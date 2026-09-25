import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Receipt,
  Utensils,
  ShoppingBag,
  Car,
  ReceiptText,
  Clapperboard,
  HeartPulse,
  GraduationCap,
  Wallet,
  BriefcaseBusiness,
  TrendingUp,
  CircleDollarSign,
  RotateCcw,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import api from "../services/api";


/* =========================================================
   CATEGORIES
   ========================================================= */

const categories = [
  "Food",
  "Shopping",
  "Transport",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Salary",
  "Business",
  "Investment",
  "Other",
];


const categoryIcons = {
  Food: Utensils,
  Shopping: ShoppingBag,
  Transport: Car,
  Bills: ReceiptText,
  Entertainment: Clapperboard,
  Health: HeartPulse,
  Education: GraduationCap,
  Salary: Wallet,
  Business: BriefcaseBusiness,
  Investment: TrendingUp,
  Other: CircleDollarSign,
};


/* =========================================================
   GLASS DROPDOWN
   ========================================================= */

function GlassDropdown({
  value,
  options,
  placeholder,
  icon: Icon,
  onChange,
  minWidth = "min-w-[150px]",
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption?.label || placeholder;

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = Math.min(288, Math.max(160, options.length * 46 + 16));
    const spaceBelow = window.innerHeight - rect.bottom;
    const openAbove = spaceBelow < menuHeight + 18 && rect.top > menuHeight + 18;

    setPosition({
      left: rect.left,
      width: rect.width,
      top: openAbove ? rect.top - menuHeight - 8 : rect.bottom + 8,
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleOutsideClick = (event) => {
      if (
        buttonRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleViewportChange = () => updatePosition();

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, options.length]);

  const menu = open && position
    ? createPortal(
        <div
          ref={menuRef}
          role="listbox"
          className="z-[9999] max-h-72 overflow-y-auto rounded-2xl border border-white/80 bg-gradient-to-br from-white/[0.88] via-purple-50/[0.78] to-violet-100/[0.68] p-2 shadow-[0_28px_70px_rgba(35,25,55,0.22),0_0_0_1px_rgba(139,92,246,0.08)] backdrop-blur-3xl dark:border-white/[0.14] dark:from-[#22202d]/[0.94] dark:via-[#191821]/[0.90] dark:to-purple-950/[0.52] dark:shadow-[0_28px_70px_rgba(0,0,0,0.50),0_0_0_1px_rgba(139,92,246,0.12)]"
          style={{
            position: "fixed",
            left: position.left,
            top: position.top,
            width: position.width,
            animation: "glassDropdownIn 360ms cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {options.map((option) => {
            const selected = option.value === value;
            const OptionIcon = option.icon;

            return (
              <button
                key={option.value || "all"}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-extrabold transition-all duration-200 ${
                  selected
                    ? "bg-gradient-to-r from-purple-200/90 via-violet-100/85 to-purple-100/75 text-purple-800 shadow-sm dark:from-purple-500/25 dark:via-violet-500/15 dark:to-purple-500/[0.08] dark:text-purple-100"
                    : "text-slate-800 hover:-translate-y-px hover:bg-gradient-to-r hover:from-white/[0.88] hover:via-purple-100/[0.72] hover:to-violet-100/[0.65] hover:shadow-sm dark:text-slate-100 dark:hover:from-white/[0.10] dark:hover:via-purple-500/[0.10] dark:hover:to-violet-500/[0.08]"
                }`}
              >
                {OptionIcon && (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-purple-200/70 bg-gradient-to-br from-purple-100/95 to-violet-100/80 text-purple-600 shadow-sm dark:border-purple-400/20 dark:from-purple-500/25 dark:to-violet-500/10 dark:text-purple-200">
                    <OptionIcon size={15} />
                  </span>
                )}
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div className={`relative ${minWidth}`}>
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-extrabold outline-none backdrop-blur-2xl transition-all duration-300 ${
            open
              ? "border-purple-400/70 bg-gradient-to-br from-white/[0.88] via-purple-50/[0.72] to-violet-100/[0.58] shadow-[0_0_0_4px_rgba(139,92,246,0.10),0_18px_45px_rgba(139,92,246,0.12)] dark:border-purple-400/60 dark:from-white/[0.12] dark:via-purple-950/[0.30] dark:to-violet-950/[0.22]"
              : "border-white/85 bg-gradient-to-br from-white/[0.78] via-purple-50/[0.58] to-violet-100/[0.46] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_30px_rgba(109,74,255,0.07)] hover:border-purple-300/70 dark:border-white/[0.12] dark:from-white/[0.08] dark:via-purple-950/[0.24] dark:to-violet-950/[0.20]"
          } text-slate-800 dark:text-slate-100`}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {Icon && <Icon size={17} className="shrink-0 text-purple-500 dark:text-purple-300" />}
            <span className={`truncate ${selectedOption ? "text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}>
              {displayText}
            </span>
          </span>
          <ChevronDown
            size={17}
            className={`shrink-0 text-slate-500 transition-transform duration-300 ${open ? "rotate-180 text-purple-600 dark:text-purple-300" : ""}`}
          />
        </button>
      </div>
      {menu}
    </>
  );
}

const categoryDropdownOptions = [
  { value: "", label: "Select category", icon: Receipt },
  ...categories.map((category) => ({
    value: category,
    label: category,
    icon: categoryIcons[category] || CircleDollarSign,
  })),
];

/* =========================================================
   COMPONENT
   ========================================================= */

function Transactions() {

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================
     MODAL
     ========================= */

  const [showModal, setShowModal] =
    useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState(null);


  /* =========================
     FORM
     ========================= */

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date()
      .toISOString()
      .split("T")[0],
  });

  const [formError, setFormError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [categoryOpen, setCategoryOpen] =
    useState(false);


  /* =========================
     FILTERS
     ========================= */

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [sort, setSort] =
    useState("newest");


  /* =========================
     PAGINATION
     ========================= */

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalTransactions, setTotalTransactions] =
    useState(0);


  /* =========================
     TREND DATA
     ========================= */

  const [trendData, setTrendData] =
    useState([]);

  const [trendLoading, setTrendLoading] =
    useState(true);


  /* =========================================================
     FETCH TRANSACTIONS
     ========================================================= */

  const fetchTransactions = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/transactions",
          {
            params: {
              page,
              limit: 10,
              search:
                search || undefined,
              type:
                typeFilter || undefined,
              category:
                categoryFilter || undefined,
              sort,
            },
          }
        );


      setTransactions(
        response.data.transactions || []
      );

      setTotalPages(
        response.data.totalPages || 1
      );

      setTotalTransactions(
        response.data.totalTransactions || 0
      );

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Failed to load transactions."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================================================
     FETCH TREND
     ========================================================= */

  const fetchTrendData = async () => {

    try {

      setTrendLoading(true);

      const response =
        await api.get(
          "/transactions",
          {
            params: {
              page: 1,
              limit: 100,
              sort: "oldest",
            },
          }
        );


      const allTransactions =
        response.data.transactions || [];


      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );


      const days = [];

      for (
        let i = 6;
        i >= 0;
        i -= 1
      ) {

        const date =
          new Date(today);

        date.setDate(
          today.getDate() - i
        );

        days.push({
          date,
          label:
            date.toLocaleDateString(
              "en-IN",
              {
                weekday: "short",
              }
            ),
          income: 0,
          expense: 0,
        });

      }


      allTransactions.forEach(
        (transaction) => {

          const transactionDate =
            new Date(
              transaction.date
            );

          transactionDate.setHours(
            0,
            0,
            0,
            0
          );


          const day =
            days.find(
              (item) =>
                item.date.getTime() ===
                transactionDate.getTime()
            );


          if (!day) {
            return;
          }


          if (
            transaction.type ===
            "income"
          ) {

            day.income += Number(
              transaction.amount || 0
            );

          } else {

            day.expense += Number(
              transaction.amount || 0
            );

          }

        }
      );


      setTrendData(
        days.map((item) => ({
          name: item.label,
          income: item.income,
          expense: item.expense,
        }))
      );

    } catch (err) {

      console.error(
        "Failed to load trend data:",
        err
      );

    } finally {

      setTrendLoading(false);

    }
  };


  /* =========================================================
     INITIAL / FILTER FETCH
     ========================================================= */

  useEffect(() => {
    fetchTransactions();
  }, [
    page,
    typeFilter,
    categoryFilter,
    sort,
  ]);


  useEffect(() => {
    fetchTrendData();
  }, []);


  /* =========================================================
     SEARCH
     ========================================================= */

  const handleSearch = async (e) => {

    e.preventDefault();

    if (page !== 1) {
      setPage(1);
      return;
    }

    await fetchTransactions();

  };


  /* =========================================================
     CLEAR FILTERS
     ========================================================= */

  const clearFilters = () => {

    setSearch("");
    setTypeFilter("");
    setCategoryFilter("");
    setSort("newest");
    setPage(1);

  };


  const hasActiveFilters =
    Boolean(
      search ||
      typeFilter ||
      categoryFilter ||
      sort !== "newest"
    );


  /* =========================================================
     ADD MODAL
     ========================================================= */

  const openAddModal = () => {

    setEditingTransaction(null);

    setForm({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date()
        .toISOString()
        .split("T")[0],
    });

    setFormError("");
    setShowModal(true);

  };


  /* =========================================================
     EDIT MODAL
     ========================================================= */

  const openEditModal = (
    transaction
  ) => {

    setEditingTransaction(
      transaction
    );

    setForm({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description:
        transaction.description ||
        "",
      date: transaction.date
        ? new Date(
            transaction.date
          )
            .toISOString()
            .split("T")[0]
        : new Date()
            .toISOString()
            .split("T")[0],
    });

    setFormError("");
    setCategoryOpen(false);
    setShowModal(true);

  };


  /* =========================================================
     CLOSE MODAL
     ========================================================= */

  const closeModal = () => {

    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingTransaction(null);
    setFormError("");
    setCategoryOpen(false);

  };


  /* =========================================================
     FORM CHANGE
     ========================================================= */

  const handleFormChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );

    if (formError) {
      setFormError("");
    }

  };


  /* =========================================================
     SAVE TRANSACTION
     ========================================================= */

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    setFormError("");

    const amount =
      Number(form.amount);


    if (
      !amount ||
      amount <= 0
    ) {

      setFormError(
        "Enter a valid amount greater than ₹0."
      );

      return;
    }


    if (
      !form.category.trim()
    ) {

      setFormError(
        "Please select a category."
      );

      return;
    }


    if (!form.date) {

      setFormError(
        "Please select a date."
      );

      return;
    }


    setSaving(true);


    try {

      const payload = {
        type: form.type,
        amount,
        category:
          form.category,
        description:
          form.description.trim(),
        date: form.date,
      };


      if (
        editingTransaction
      ) {

        await api.put(
          `/transactions/${editingTransaction._id}`,
          payload
        );

      } else {

        await api.post(
          "/transactions",
          payload
        );

      }


      setShowModal(false);
      setEditingTransaction(
        null
      );

      await fetchTransactions();
      await fetchTrendData();

    } catch (err) {

      setFormError(
        err.response?.data?.message ||
          "Failed to save transaction."
      );

    } finally {

      setSaving(false);

    }

  };


  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Delete this transaction?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await api.delete(
        `/transactions/${id}`
      );


      if (
        transactions.length ===
          1 &&
        page > 1
      ) {

        setPage(
          (prev) => prev - 1
        );

      } else {

        await fetchTransactions();

      }


      await fetchTrendData();

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Failed to delete transaction."
      );

    }

  };


  /* =========================================================
     FORMATTERS
     ========================================================= */

  const formatAmount = (
    amount
  ) => {

    return Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    );

  };


  const formatDate = (
    date
  ) => {

    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  /* =========================================================
     CATEGORY ICON
     ========================================================= */

  const getCategoryIcon = (
    category
  ) => {

    return (
      categoryIcons[
        category
      ] || CircleDollarSign
    );

  };


  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-10 text-sm font-bold text-slate-600 dark:text-slate-300">
        Loading transactions...
      </div>
    );

  }


  /* =========================================================
     UI
     ========================================================= */

  return (

    <div className="min-h-full w-full space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-1.2px] text-slate-950 dark:text-white">
            Transactions
          </h2>

          <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
            Keep track of every rupee coming in and going out.
          </p>

        </div>


        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-purple-200 bg-purple-600 px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-purple-400/20 dark:bg-purple-500 dark:hover:bg-purple-400"
          onClick={
            openAddModal
          }
        >

          <Plus size={20} />

          Add Transaction

        </button>

      </div>


      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">


        <div className="flex items-center gap-4 rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-100/90 via-purple-50/55 to-white p-4 shadow-[0_12px_32px_rgba(124,58,237,0.08)] backdrop-blur-xl dark:border-purple-400/20 dark:from-purple-500/15 dark:via-[#15151d] dark:to-[#15151d]">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
            <Receipt size={20} />
          </div>

          <div>

            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Total Records
            </span>

            <strong className="mt-0.5 block text-xl font-black text-slate-950 dark:text-white">
              {totalTransactions}
            </strong>

          </div>

        </div>


        <div className="flex items-center gap-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-100/90 via-emerald-50/55 to-white p-4 shadow-[0_12px_32px_rgba(16,185,129,0.08)] backdrop-blur-xl dark:border-emerald-400/20 dark:from-emerald-500/15 dark:via-[#15151d] dark:to-[#15151d]">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <ArrowUpRight size={20} />
          </div>

          <div>

            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Income
            </span>

            <strong className="mt-0.5 block text-xl font-black text-slate-950 dark:text-white">
              {
                transactions.filter(
                  (item) =>
                    item.type ===
                    "income"
                ).length
              }
            </strong>

          </div>

        </div>


        <div className="flex items-center gap-4 rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-100/90 via-red-50/55 to-white p-4 shadow-[0_12px_32px_rgba(239,68,68,0.08)] backdrop-blur-xl dark:border-red-400/20 dark:from-red-500/15 dark:via-[#15151d] dark:to-[#15151d]">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
            <ArrowDownRight size={20} />
          </div>

          <div>

            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Expenses
            </span>

            <strong className="mt-0.5 block text-xl font-black text-slate-950 dark:text-white">
              {
                transactions.filter(
                  (item) =>
                    item.type ===
                    "expense"
                ).length
              }
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          7 DAY TREND
          ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-purple-100/80 bg-gradient-to-br from-white via-purple-50/25 to-white p-5 shadow-[0_16px_40px_rgba(20,24,31,0.06)] backdrop-blur-xl dark:border-purple-400/10 dark:from-[#15151d] dark:via-purple-500/[0.04] dark:to-[#15151d] sm:p-6">

        <div className="flex items-start justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
                <TrendingUp
                  size={19}
                />
              </div>

              <h3 className="font-[Manrope] text-xl font-extrabold tracking-[-0.5px] text-slate-950 dark:text-white">
                7-Day Spending Trend
              </h3>

            </div>

            <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
              Your income and expenses over the last seven days
            </p>

          </div>

        </div>


        <div className="mt-5 h-[230px] w-full">

          {trendLoading ? (

            <div className="flex h-full items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
              Loading trend...
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height={230}
            >

              <AreaChart
                data={trendData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#55b887"
                      stopOpacity={0.28}
                    />

                    <stop
                      offset="100%"
                      stopColor="#55b887"
                      stopOpacity={0.02}
                    />
                  </linearGradient>


                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#d86b6b"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="100%"
                      stopColor="#d86b6b"
                      stopOpacity={0.02}
                    />
                  </linearGradient>

                </defs>


                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#e5e0e8"
                />


                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#403846",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />


                <YAxis
                  tick={{
                    fill: "#403846",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    `₹${value}`
                  }
                />


                <Tooltip
                  formatter={(value) =>
                    `₹${Number(
                      value
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  }
                  contentStyle={{
                    borderRadius: "12px",
                    border:
                      "1px solid #d3ccd9",
                    boxShadow:
                      "0 10px 25px rgba(35,25,45,0.12)",
                    background:
                      "#ffffff",
                    color: "#201a27",
                  }}
                />


                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#39966d"
                  strokeWidth={2.5}
                  fill="url(#incomeGradient)"
                  name="Income"
                />


                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#c95c5c"
                  strokeWidth={2.5}
                  fill="url(#expenseGradient)"
                  name="Expense"
                />

              </AreaChart>

            </ResponsiveContainer>

          )}

        </div>


        <div className="mt-2 flex items-center justify-end gap-5 text-xs font-bold text-slate-600 dark:text-slate-300">

          <span>
            <i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 align-middle" />
            Income
          </span>

          <span>
            <i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-red-500 align-middle" />
            Expenses
          </span>

        </div>

      </section>


      {/* =====================================================
          SEARCH + FILTERS
          ===================================================== */}

      <div className="flex flex-col gap-4 rounded-3xl border border-purple-100/80 bg-gradient-to-br from-white via-purple-50/20 to-white p-4 shadow-[0_12px_30px_rgba(20,24,31,0.05)] backdrop-blur-xl dark:border-purple-400/10 dark:from-[#15151d] dark:via-purple-500/[0.035] dark:to-[#15151d] lg:flex-row lg:items-center lg:justify-between">


        <form
          className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white px-4 py-3 text-slate-600 shadow-sm transition focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-100 dark:border-white/[0.08] dark:from-[#1b1c25] dark:to-[#15151d] dark:text-slate-300 dark:focus-within:border-purple-400/40 dark:focus-within:ring-purple-500/10"
          onSubmit={
            handleSearch
          }
        >

          <Search size={20} />

          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />


          {search && (

            <button
              type="button"
              className="ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-white/[0.08] dark:hover:text-white"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
            >
              <X size={17} />
            </button>

          )}

        </form>


        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">


          <GlassDropdown
            value={typeFilter}
            placeholder="All Types"
            icon={Filter}
            options={[
              { value: "", label: "All Types", icon: Filter },
              { value: "income", label: "Income", icon: ArrowUpRight },
              { value: "expense", label: "Expense", icon: ArrowDownRight },
            ]}
            onChange={(value) => {
              setTypeFilter(value);
              setPage(1);
            }}
          />


          <GlassDropdown
            value={categoryFilter}
            placeholder="All Categories"
            options={[
              { value: "", label: "All Categories", icon: Receipt },
              ...categories.map((category) => ({
                value: category,
                label: category,
                icon: getCategoryIcon(category),
              })),
            ]}
            onChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
          />


          <GlassDropdown
            value={sort}
            placeholder="Newest"
            options={[
              { value: "newest", label: "Newest", icon: TrendingUp },
              { value: "oldest", label: "Oldest", icon: CalendarDays },
              { value: "amountHigh", label: "Highest Amount", icon: ArrowUpRight },
              { value: "amountLow", label: "Lowest Amount", icon: ArrowDownRight },
            ]}
            onChange={(value) => {
              setSort(value);
              setPage(1);
            }}
          />


          {hasActiveFilters && (

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-xs font-extrabold text-purple-700 transition hover:bg-purple-100 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20"
              onClick={
                clearFilters
              }
            >

              <RotateCcw
                size={15}
              />

              Clear Filters

            </button>

          )}

        </div>

      </div>


      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (

        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>

      )}


      {/* =====================================================
          ALL TRANSACTIONS
          ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/35 to-white shadow-[0_16px_40px_rgba(20,24,31,0.06)] backdrop-blur-xl dark:border-white/[0.08] dark:from-[#15151d] dark:via-[#181821] dark:to-[#15151d]">


        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-6 dark:border-white/[0.08] sm:px-7">

          <div>

            <h3 className="font-[Manrope] text-xl font-extrabold tracking-[-0.5px] text-slate-950 dark:text-white">
              All Transactions
            </h3>

            <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
              Your complete financial activity
            </p>

          </div>

        </div>


        {transactions.length > 0 ? (

          <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[900px] border-collapse">

              <thead>

                <tr>

                  <th className="whitespace-nowrap border-b border-slate-200/80 bg-gradient-to-r from-purple-50/55 to-slate-50/70 px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:border-white/[0.08] dark:from-purple-500/[0.06] dark:to-[#1b1c25] dark:text-slate-400">
                    Transaction
                  </th>

                  <th className="whitespace-nowrap border-b border-slate-200/80 bg-gradient-to-r from-purple-50/55 to-slate-50/70 px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:border-white/[0.08] dark:from-purple-500/[0.06] dark:to-[#1b1c25] dark:text-slate-400">
                    Category
                  </th>

                  <th className="whitespace-nowrap border-b border-slate-200/80 bg-gradient-to-r from-purple-50/55 to-slate-50/70 px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:border-white/[0.08] dark:from-purple-500/[0.06] dark:to-[#1b1c25] dark:text-slate-400">
                    Date
                  </th>

                  <th className="whitespace-nowrap border-b border-slate-200/80 bg-gradient-to-r from-purple-50/55 to-slate-50/70 px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:border-white/[0.08] dark:from-purple-500/[0.06] dark:to-[#1b1c25] dark:text-slate-400">
                    Type
                  </th>

                  <th className="whitespace-nowrap border-b border-slate-200/80 bg-gradient-to-r from-purple-50/55 to-slate-50/70 px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:border-white/[0.08] dark:from-purple-500/[0.06] dark:to-[#1b1c25] dark:text-slate-400">
                    Amount
                  </th>

                  <th>
                  </th>

                </tr>

              </thead>


              <tbody>

                {transactions.map(
                  (transaction) => {

                    const CategoryIcon =
                      getCategoryIcon(
                        transaction.category
                      );


                    return (

                      <tr
                        className="border-b border-slate-100/80 transition hover:bg-purple-50/40 dark:border-white/[0.06] dark:hover:bg-purple-500/[0.04]"
                        key={
                          transaction._id
                        }
                      >


                        <td className="px-5 py-5 align-middle sm:px-6">

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                                transaction.type === "income"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                                  : "border-red-200 bg-red-50 text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300"
                              }`}
                            >

                              {transaction.type ===
                              "income" ? (

                                <ArrowUpRight
                                  size={19}
                                />

                              ) : (

                                <ArrowDownRight
                                  size={19}
                                />

                              )}

                            </div>


                            <div>

                              <strong className="block max-w-[280px] truncate text-sm font-extrabold text-slate-900 dark:text-white">
                                {transaction.description ||
                                  "Untitled transaction"}
                              </strong>

                              <span className="mt-0.5 block text-xs font-bold text-slate-500 dark:text-slate-400">
                                {transaction.type ===
                                "income"
                                  ? "Money received"
                                  : "Money spent"}
                              </span>

                            </div>

                          </div>

                        </td>


                        <td className="px-5 py-5 align-middle sm:px-6">

                          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-white/[0.08] dark:bg-[#1b1c25] dark:text-slate-200">

                            <CategoryIcon
                              size={14}
                            />

                            {transaction.category}

                          </span>

                        </td>


                        <td className="px-5 py-5 align-middle sm:px-6">

                          <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">

                            <CalendarDays
                              size={15}
                            />

                            {formatDate(
                              transaction.date
                            )}

                          </div>

                        </td>


                        <td className="px-5 py-5 align-middle sm:px-6">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${
                              transaction.type === "income"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                                : "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300"
                            }`}
                          >

                            {transaction.type}

                          </span>

                        </td>


                        <td className="px-5 py-5 align-middle sm:px-6">

                          <strong
                            className={`text-sm font-extrabold ${
                              transaction.type === "income"
                                ? "text-emerald-600 dark:text-emerald-300"
                                : "text-red-600 dark:text-red-300"
                            }`}
                          >

                            {transaction.type ===
                            "income"
                              ? "+"
                              : "-"}

                            ₹
                            {formatAmount(
                              transaction.amount
                            )}

                          </strong>

                        </td>


                        <td className="px-5 py-5 align-middle sm:px-6">

                          <div className="flex items-center justify-end gap-2">

                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600 dark:border-white/[0.08] dark:bg-[#1b1c25] dark:text-slate-300 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
                              type="button"
                              title="Edit"
                              onClick={() =>
                                openEditModal(
                                  transaction
                                )
                              }
                            >

                              <Pencil
                                size={16}
                              />

                            </button>


                            <button
                              type="button"
                              title="Delete"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                              onClick={() =>
                                handleDelete(
                                  transaction._id
                                )
                              }
                            >

                              <Trash2
                                size={16}
                              />

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">

              <Receipt
                size={30}
              />

            </div>


            <h3 className="font-[Manrope] text-xl font-extrabold text-slate-950 dark:text-white">
              No transactions found
            </h3>


            <p className="mt-2 max-w-md text-sm font-bold text-slate-600 dark:text-slate-300">
              Try changing your filters or add a new transaction.
            </p>


            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">

              {hasActiveFilters && (

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/[0.08] dark:bg-[#1b1c25] dark:text-slate-200 dark:hover:bg-white/[0.06]"
                  onClick={
                    clearFilters
                  }
                >

                  <RotateCcw
                    size={17}
                  />

                  Clear Filters

                </button>

              )}


              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(124,58,237,0.18)] transition hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400"
                onClick={
                  openAddModal
                }
              >

                <Plus
                  size={18}
                />

                Add Transaction

              </button>

            </div>

          </div>

        )}


        {/* ===================================================
            PAGINATION
            =================================================== */}

        {totalPages > 1 && (

          <div className="flex flex-col gap-3 border-t border-slate-200/80 px-5 py-4 text-sm font-bold text-slate-600 dark:border-white/[0.08] dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <span>
              Page {page} of {totalPages}
            </span>


            <div>

              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:bg-[#1b1c25] dark:text-slate-300"
                type="button"
                disabled={
                  page <= 1
                }
                onClick={() =>
                  setPage(
                    (prev) =>
                      prev - 1
                  )
                }
              >

                <ChevronLeft
                  size={18}
                />

              </button>


              <button
                type="button"
                disabled={
                  page >=
                  totalPages
                }
                onClick={() =>
                  setPage(
                    (prev) =>
                      prev + 1
                  )
                }
              >

                <ChevronRight
                  size={18}
                />

              </button>

            </div>

          </div>

        )}

      </section>


      {/* =====================================================
          ADD / EDIT MODAL
          ===================================================== */}

      {showModal && (
        <>
          <style>{`
            @keyframes glassDropdownIn {
              from {
                opacity: 0;
                transform: translateY(-5px) scale(0.985);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @keyframes apnaKhataBackdropIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes apnaKhataModalIn {
              0% {
                opacity: 0;
                transform: translateY(24px) scale(0.94);
                filter: blur(4px);
              }
              60% {
                opacity: 1;
                transform: translateY(-3px) scale(1.008);
                filter: blur(0);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
              }
            }
          `}</style>

          <div
            className="fixed left-0 right-0 bottom-0 top-[90px] z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/[0.14] p-4 backdrop-blur-[7px] sm:p-6"
            style={{ animation: "apnaKhataBackdropIn 500ms ease-out both" }}
            onMouseDown={(e) => {
              if (
                e.target === e.currentTarget &&
                !saving
              ) {
                closeModal();
              }
            }}
          >
            <div
              className="my-auto w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-white/[0.78] via-white/[0.66] to-purple-50/[0.62] shadow-[0_30px_90px_rgba(15,23,42,0.20),0_0_45px_rgba(124,58,237,0.10)] backdrop-blur-3xl supports-[backdrop-filter]:bg-white/[0.60] dark:border-white/[0.16] dark:from-[#24222f]/[0.82] dark:via-[#181820]/[0.76] dark:to-purple-950/[0.34] dark:shadow-[0_30px_90px_rgba(0,0,0,0.45),0_0_45px_rgba(139,92,246,0.10)]"
              style={{
                animation:
                  "apnaKhataModalIn 700ms cubic-bezier(0.16, 1, 0.3, 1) both",
                willChange: "transform, opacity, filter",
              }}
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/65 bg-white/[0.18] px-5 py-4 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">
                <div>
                  <span className="text-[11px] font-extrabold tracking-[0.18em] text-purple-600 dark:text-purple-300">
                    {editingTransaction ? "UPDATE ENTRY" : "NEW ENTRY"}
                  </span>

                  <h3 className="mt-0.5 font-[Manrope] text-xl font-extrabold tracking-[-0.6px] text-slate-950 dark:text-white">
                    {editingTransaction
                      ? "Edit Transaction"
                      : "Add Transaction"}
                  </h3>
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white/[0.65] text-slate-700 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.85] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.10] dark:bg-white/[0.07] dark:text-slate-200 dark:hover:bg-white/[0.12]"
                  onClick={closeModal}
                  disabled={saving}
                >
                  <X size={20} />
                </button>
              </div>

              <form
                className="space-y-4 px-5 py-5 sm:px-6 sm:py-6"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-white/75 bg-white/[0.38] p-1.5 shadow-inner backdrop-blur-xl dark:border-white/[0.10] dark:bg-white/[0.04]">
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition-all duration-300 ${
                      form.type === "expense"
                        ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-[0_8px_20px_rgba(239,68,68,0.22)]"
                        : "text-slate-700 hover:bg-white/[0.72] dark:text-slate-300 dark:hover:bg-white/[0.07]"
                    }`}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        type: "expense",
                      }))
                    }
                  >
                    <ArrowDownRight size={18} />
                    Expense
                  </button>

                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition-all duration-300 ${
                      form.type === "income"
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.22)]"
                        : "text-slate-700 hover:bg-white/[0.72] dark:text-slate-300 dark:hover:bg-white/[0.07]"
                    }`}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        type: "income",
                      }))
                    }
                  >
                    <ArrowUpRight size={18} />
                    Income
                  </button>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-extrabold text-slate-800 dark:text-slate-200"
                    htmlFor="amount"
                  >
                    Amount
                  </label>

                  <div className="flex items-center overflow-hidden rounded-2xl border border-white/85 bg-gradient-to-r from-purple-50/[0.72] via-white/[0.62] to-white/[0.48] shadow-sm backdrop-blur-xl transition-all duration-300 focus-within:border-purple-400/70 focus-within:ring-4 focus-within:ring-purple-200/45 dark:border-white/[0.10] dark:from-purple-950/[0.28] dark:via-white/[0.05] dark:to-white/[0.03] dark:focus-within:border-purple-400/50 dark:focus-within:ring-purple-500/10">
                    <span className="border-r border-purple-200/70 px-4 text-lg font-black text-purple-600 dark:border-white/[0.08] dark:text-purple-300">
                      ₹
                    </span>

                    <input
                      className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-lg font-extrabold text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
                      id="amount"
                      name="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-extrabold text-slate-800 dark:text-slate-200"
                      htmlFor="category"
                    >
                      Category
                    </label>

                    <GlassDropdown
                      value={form.category}
                      placeholder="Select category"
                      options={categoryDropdownOptions}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, category: value }));
                        setFormError("");
                      }}
                      minWidth="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-extrabold text-slate-800 dark:text-slate-200"
                      htmlFor="date"
                    >
                      Date
                    </label>

                    <input
                      className="w-full rounded-2xl border border-white/85 bg-gradient-to-br from-white/[0.72] to-purple-50/[0.48] px-4 py-3 text-sm font-bold text-slate-800 outline-none backdrop-blur-xl transition-all duration-300 focus:border-purple-400/70 focus:ring-4 focus:ring-purple-200/45 dark:border-white/[0.10] dark:from-white/[0.07] dark:to-purple-950/[0.22] dark:text-slate-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-500/10"
                      id="date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-extrabold text-slate-800 dark:text-slate-200"
                    htmlFor="description"
                  >
                    Description
                  </label>

                  <textarea
                    className="w-full resize-none rounded-2xl border border-white/85 bg-gradient-to-br from-white/[0.72] via-white/[0.58] to-purple-50/[0.48] px-4 py-3 text-sm font-semibold text-slate-800 outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-400 focus:border-purple-400/70 focus:ring-4 focus:ring-purple-200/45 dark:border-white/[0.10] dark:from-white/[0.07] dark:via-white/[0.04] dark:to-purple-950/[0.22] dark:text-slate-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-500/10"
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="What was this transaction for?"
                    value={form.description}
                    onChange={handleFormChange}
                  />
                </div>

                {formError && (
                  <div className="rounded-2xl border border-red-200/80 bg-gradient-to-r from-red-50/[0.86] to-rose-50/[0.62] px-4 py-3 text-sm font-bold text-red-700 dark:border-red-400/20 dark:from-red-500/[0.12] dark:to-rose-500/[0.06] dark:text-red-300">
                    {formError}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-white/70 pt-5 dark:border-white/[0.08] sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/85 bg-white/[0.58] px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.82] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.10] dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/[0.10]"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(124,58,237,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingTransaction
                      ? "Update Transaction"
                      : "Save Transaction"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>

  );
}

export default Transactions;