import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  IndianRupee,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  HandCoins,
  X,
} from "lucide-react";
import api from "../services/api";

function MoneyOwed() {
  const [records, setRecords] = useState([]);

  const [summary, setSummary] = useState({
    totalGiven: 0,
    totalBorrowed: 0,
    totalDueSoon: 0,
    totalOverdue: 0,
  });

  const [selectedType, setSelectedType] = useState("given");

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRepayment, setShowRepayment] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [repaymentId, setRepaymentId] = useState(null);

  const [form, setForm] = useState({
    person: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "cash",
    reason: "",
    dueDate: "",
    notes: "",
  });

  const [repaymentForm, setRepaymentForm] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "cash",
    note: "",
  });

  // =========================================================
  // FETCH MONEY OWED
  // =========================================================

  const fetchMoneyOwed = async () => {
    try {
      setLoading(true);

      const response = await api.get("/money-owed");

      /*
        IMPORTANT:
        Backend returns:

        {
          count,
          summary,
          moneyOwed
        }

        So we MUST read response.data.moneyOwed.
      */
      setRecords(response.data.moneyOwed || []);

      setSummary(
        response.data.summary || {
          totalGiven: 0,
          totalBorrowed: 0,
          totalDueSoon: 0,
          totalOverdue: 0,
        }
      );
    } catch (error) {
      console.error("Failed to fetch money owed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load Money Owed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoneyOwed();
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredRecords = records.filter(
    (record) => record.type === selectedType
  );

  // =========================================================
  // FORM HANDLERS
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRepaymentChange = (e) => {
    const { name, value } = e.target;

    setRepaymentForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setForm({
      person: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      method: "cash",
      reason: "",
      dueDate: "",
      notes: "",
    });

    setEditingId(null);
  };

  // =========================================================
  // OPEN ADD
  // =========================================================

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // =========================================================
  // CHANGE TYPE
  // =========================================================

  const changeType = (type) => {
    setSelectedType(type);
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEditForm = (record) => {
    setEditingId(record._id);

    setSelectedType(record.type);

    setForm({
      person: record.person || "",
      amount: record.amount || "",
      date: record.date
        ? new Date(record.date).toISOString().split("T")[0]
        : "",
      method: record.method || "cash",
      reason: record.reason || "",
      dueDate: record.dueDate
        ? new Date(record.dueDate)
            .toISOString()
            .split("T")[0]
        : "",
      notes: record.notes || "",
    });

    setShowForm(true);
  };

  // =========================================================
  // ADD / EDIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.person.trim()) {
      alert("Please enter the person's name.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!form.date) {
      alert("Please select the date.");
      return;
    }

    if (form.dueDate && form.dueDate < form.date) {
      alert(
        "Due date cannot be before the given/borrowed date."
      );
      return;
    }

    try {
      const data = {
        ...form,
        type: selectedType,
        amount: Number(form.amount),
        dueDate: form.dueDate || null,
      };

      if (editingId) {
        await api.put(
          `/money-owed/${editingId}`,
          data
        );

        alert("Money record updated successfully.");
      } else {
        await api.post("/money-owed", data);

        alert(
          selectedType === "given"
            ? "Money given record added successfully."
            : "Money borrowed record added successfully."
        );
      }

      setShowForm(false);
      resetForm();

      await fetchMoneyOwed();
    } catch (error) {
      console.error("Money owed save error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save record."
      );
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this money record? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/money-owed/${id}`);

      alert("Record deleted successfully.");

      await fetchMoneyOwed();
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete record."
      );
    }
  };

  // =========================================================
  // REPAYMENT / PAYMENT
  // =========================================================

  const openRepayment = (record) => {
    setRepaymentId(record._id);

    setSelectedType(record.type);

    setRepaymentForm({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      method: "cash",
      note: "",
    });

    setShowRepayment(true);
  };

  const handleRepaymentSubmit = async (e) => {
    e.preventDefault();

    if (
      !repaymentForm.amount ||
      Number(repaymentForm.amount) <= 0
    ) {
      alert("Please enter a valid repayment amount.");
      return;
    }

    try {
      await api.post(
        `/money-owed/${repaymentId}/repay`,
        {
          amount: Number(repaymentForm.amount),
          date: repaymentForm.date,
          method: repaymentForm.method,
          note: repaymentForm.note,
        }
      );

      alert("Repayment added successfully.");

      setShowRepayment(false);
      setRepaymentId(null);

      await fetchMoneyOwed();
    } catch (error) {
      console.error("Repayment error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add repayment."
      );
    }
  };

  // =========================================================
  // FORMATTERS
  // =========================================================

  const formatMoney = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "No due date";
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

  // =========================================================
  // STATUS
  // =========================================================

  const getStatusDetails = (status) => {
    switch (status) {
      case "settled":
        return {
          label: "Settled",
          icon: CheckCircle,
          className:
            "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300",
        };

      case "overdue":
        return {
          label: "Overdue",
          icon: AlertTriangle,
          className:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",
        };

      case "dueSoon":
        return {
          label: "Due Soon",
          icon: Clock,
          className:
            "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300",
        };

      case "partiallyPaid":
        return {
          label: "Partially Paid",
          icon: IndianRupee,
          className:
            "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300",
        };

      default:
        return {
          label: "Pending",
          icon: Clock,
          className:
            "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
        };
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-112px)] p-6 md:p-8">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-200 bg-purple-50 text-purple-600 shadow-sm dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300">
              <HandCoins size={28} />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Loading Money Owed...
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Loading your lending and borrowing records.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="min-h-[calc(100vh-112px)] bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 shadow-sm dark:border-purple-900/50 dark:from-purple-950/60 dark:to-indigo-950/60 dark:text-purple-300">
                <HandCoins size={28} />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                  Money Owed
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Keep track of money you gave and money you borrowed.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg"
          >
            <Plus size={18} />
            Add Record
          </button>
        </div>

        {/* =================================================
            GIVEN / BORROWED TABS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* MONEY GIVEN */}

          <button
            type="button"
            onClick={() => changeType("given")}
            className={`rounded-2xl border p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              selectedType === "given"
                ? "border-purple-300 bg-gradient-to-br from-purple-50 via-white to-indigo-50 ring-2 ring-purple-500/10 dark:border-purple-700 dark:from-purple-950/50 dark:via-slate-900 dark:to-indigo-950/40"
                : "border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/70"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300">
                <ArrowUpRight size={23} />
              </div>

              <div>
                <strong className="block text-sm font-bold text-slate-900 dark:text-white">
                  Money Given
                </strong>

                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {formatMoney(summary.totalGiven)} to receive
                </span>
              </div>
            </div>
          </button>

          {/* MONEY BORROWED */}

          <button
            type="button"
            onClick={() => changeType("borrowed")}
            className={`rounded-2xl border p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              selectedType === "borrowed"
                ? "border-purple-300 bg-gradient-to-br from-purple-50 via-white to-indigo-50 ring-2 ring-purple-500/10 dark:border-purple-700 dark:from-purple-950/50 dark:via-slate-900 dark:to-indigo-950/40"
                : "border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/70"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300">
                <ArrowDownLeft size={23} />
              </div>

              <div>
                <strong className="block text-sm font-bold text-slate-900 dark:text-white">
                  Money Borrowed
                </strong>

                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {formatMoney(summary.totalBorrowed)} to return
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-purple-900/40 dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                  {selectedType === "given"
                    ? "Total to Receive"
                    : "Total to Return"}
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {selectedType === "given"
                    ? formatMoney(summary.totalGiven)
                    : formatMoney(summary.totalBorrowed)}
                </h2>

                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {selectedType === "given"
                    ? "Money you gave"
                    : "Money you borrowed"}
                </span>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                <IndianRupee size={22} />
              </div>
            </div>
          </div>

          {/* DUE SOON */}

          <div className="rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-orange-900/40 dark:from-orange-950/40 dark:via-slate-900 dark:to-amber-950/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-300">
                  Due Soon
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {formatMoney(summary.totalDueSoon)}
                </h2>

                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  Within 3 days
                </span>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300">
                <Clock size={22} />
              </div>
            </div>
          </div>

          {/* OVERDUE */}

          <div className="rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50 via-white to-rose-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-red-900/40 dark:from-red-950/40 dark:via-slate-900 dark:to-rose-950/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-300">
                  Overdue
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {formatMoney(summary.totalOverdue)}
                </h2>

                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  Past due date
                </span>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">
                <AlertTriangle size={22} />
              </div>
            </div>
          </div>

          {/* RECORD COUNT */}

          <div className="rounded-2xl border border-green-200/80 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-green-900/40 dark:from-green-950/40 dark:via-slate-900 dark:to-emerald-950/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-300">
                  Total Records
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {filteredRecords.length}
                </h2>

                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {selectedType === "given"
                    ? "People who owe you"
                    : "People you owe"}
                </span>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300">
                <HandCoins size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            RECORDS
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80">

          {/* RECORD HEADER */}

          <div className="flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-700/70">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedType === "given"
                  ? "Money Given"
                  : "Money Borrowed"}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {filteredRecords.length}{" "}
                {filteredRecords.length === 1
                  ? "record"
                  : "records"}
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg"
            >
              <Plus size={18} />

              Add{" "}
              {selectedType === "given"
                ? "Money Given"
                : "Money Borrowed"}
            </button>
          </div>

          {/* EMPTY */}

          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                {selectedType === "given" ? (
                  <ArrowUpRight size={36} />
                ) : (
                  <ArrowDownLeft size={36} />
                )}
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                {selectedType === "given"
                  ? "No money given yet"
                  : "No money borrowed yet"}
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                {selectedType === "given"
                  ? "Track money you have given to friends or family."
                  : "Track money you have borrowed from friends or family."}
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Plus size={18} />

                {selectedType === "given"
                  ? "Add Money Given"
                  : "Add Money Borrowed"}
              </button>
            </div>
          ) : (

            /* =================================================
               RECORD LIST
            ================================================= */

            <div className="space-y-4 p-4 sm:p-6">
              {filteredRecords.map((record) => {
                const status = getStatusDetails(
                  record.status
                );

                const StatusIcon = status.icon;

                return (
                  <div
                    key={record._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                  >

                    {/* PERSON + STATUS */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">

                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            record.type === "given"
                              ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                              : "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300"
                          }`}
                        >
                          {record.type === "given" ? (
                            <ArrowUpRight size={23} />
                          ) : (
                            <ArrowDownLeft size={23} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {record.person}
                          </h3>

                          <p
                            className={`mt-1 text-sm font-semibold ${
                              record.type === "given"
                                ? "text-green-600 dark:text-green-400"
                                : "text-orange-600 dark:text-orange-400"
                            }`}
                          >
                            {record.type === "given"
                              ? "Money Given"
                              : "Money Borrowed"}
                          </p>

                          {record.reason && (
                            <span className="mt-2 inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {record.reason}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
                      >
                        <StatusIcon size={14} />
                        {status.label}
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Original
                        </span>

                        <strong className="mt-1 block text-sm font-bold text-slate-900 dark:text-white">
                          {formatMoney(record.amount)}
                        </strong>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Remaining
                        </span>

                        <strong className="mt-1 block text-sm font-bold text-purple-600 dark:text-purple-400">
                          {formatMoney(
                            record.remainingAmount
                          )}
                        </strong>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Date
                        </span>

                        <strong className="mt-1 block text-sm font-bold text-slate-900 dark:text-white">
                          {formatDate(record.date)}
                        </strong>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Due Date
                        </span>

                        <strong className="mt-1 block text-sm font-bold text-slate-900 dark:text-white">
                          {formatDate(record.dueDate)}
                        </strong>
                      </div>
                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">

                      {/* REPAYMENT / PAYMENT */}

                      {record.status !== "settled" && (
                        <button
                          type="button"
                          onClick={() =>
                            openRepayment(record)
                          }
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 text-xs font-bold text-green-700 transition-all hover:-translate-y-0.5 hover:bg-green-100 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300 dark:hover:bg-green-900/50"
                        >
                          <IndianRupee size={16} />

                          {record.type === "given"
                            ? "Repayment"
                            : "Payment"}
                        </button>
                      )}

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(record)
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-3 text-xs font-bold text-purple-700 transition-all hover:-translate-y-0.5 hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(record._id)
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-700 transition-all hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>

                    {/* =================================================
                        REPAYMENT HISTORY
                    ================================================= */}

                    {record.repayments?.length > 0 && (
                      <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-700">
                        <strong className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {record.type === "given"
                            ? "Repayment History"
                            : "Payment History"}
                        </strong>

                        <div className="mt-3 space-y-2">
                          {record.repayments.map(
                            (repayment) => (
                              <div
                                key={repayment._id}
                                className="flex flex-col gap-2 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-800/70"
                              >
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    {formatDate(
                                      repayment.date
                                    )}
                                  </span>

                                  <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold uppercase text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                    {repayment.method}
                                  </span>

                                  {repayment.note && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {repayment.note}
                                    </span>
                                  )}
                                </div>

                                <strong className="text-sm font-bold text-green-600 dark:text-green-400">
                                  {formatMoney(
                                    repayment.amount
                                  )}
                                </strong>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
          BELOW TOPBAR
      ===================================================== */}

      {showForm && (
        <div className="fixed left-0 right-0 top-[112px] bottom-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:py-8">

          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingId
                    ? "Edit Money Record"
                    : selectedType === "given"
                    ? "Add Money Given"
                    : "Add Money Borrowed"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedType === "given"
                    ? "Record money someone needs to return to you."
                    : "Record money you need to return to someone."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100vh-155px)] overflow-y-auto p-5 sm:p-6"
            >
              <div className="space-y-5">

                {/* PERSON */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {selectedType === "given"
                      ? "Person Who Owes You"
                      : "Person You Owe"}
                  </label>

                  <input
                    type="text"
                    name="person"
                    value={form.person}
                    onChange={handleChange}
                    placeholder={
                      selectedType === "given"
                        ? "e.g. Rahul"
                        : "e.g. Amit"
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* AMOUNT + DATE */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Amount
                    </label>

                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="5000"
                      min="0.01"
                      step="0.01"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Date
                    </label>

                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* PAYMENT METHOD */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Payment Method
                  </label>

                  <select
                    name="method"
                    value={form.method}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank">
                      Bank Transfer
                    </option>
                    <option value="card">Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* REASON */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Reason
                  </label>

                  <input
                    type="text"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="e.g. Emergency help"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* DUE DATE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* NOTES */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Additional notes..."
                    rows="3"
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {editingId
                    ? "Update Record"
                    : selectedType === "given"
                    ? "Add Money Given"
                    : "Add Money Borrowed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          REPAYMENT / PAYMENT MODAL
          BELOW TOPBAR
      ===================================================== */}

      {showRepayment && (
        <div className="fixed left-0 right-0 top-[112px] bottom-0 z-[110] flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:py-8">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedType === "given"
                    ? "Add Repayment"
                    : "Add Payment"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedType === "given"
                    ? "Record money received back."
                    : "Record money you paid back."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowRepayment(false);
                  setRepaymentId(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleRepaymentSubmit}
              className="p-5 sm:p-6"
            >
              <div className="space-y-5">

                {/* AMOUNT */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={repaymentForm.amount}
                    onChange={handleRepaymentChange}
                    placeholder="2000"
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* DATE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={repaymentForm.date}
                    onChange={handleRepaymentChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* PAYMENT METHOD */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Payment Method
                  </label>

                  <select
                    name="method"
                    value={repaymentForm.method}
                    onChange={handleRepaymentChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank">
                      Bank Transfer
                    </option>
                    <option value="card">Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* NOTE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Note
                  </label>

                  <textarea
                    name="note"
                    value={repaymentForm.note}
                    onChange={handleRepaymentChange}
                    placeholder="e.g. First repayment"
                    rows="3"
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowRepayment(false);
                    setRepaymentId(null);
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {selectedType === "given"
                    ? "Add Repayment"
                    : "Add Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoneyOwed;