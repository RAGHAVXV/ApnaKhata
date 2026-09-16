import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  PiggyBank,
  CheckCircle,
  AlertTriangle,
  CircleAlert,
  Calendar,
} from "lucide-react";
import api from "../services/api";

function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [editingGoal, setEditingGoal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    goalType: "",
    targetAmount: "",
    currentSavings: "",
    targetDate: "",
    expectedAnnualIncrease: "",
    budget: "",
    status: "active",
  });

  /* =========================================================
     FETCH GOALS
  ========================================================= */

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/savings-goals");

      setGoals(response.data.savingsGoals || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load savings goals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  /* =========================================================
     FORM
  ========================================================= */

  const resetForm = () => {
    setFormData({
      name: "",
      goalType: "",
      targetAmount: "",
      currentSavings: "",
      targetDate: "",
      expectedAnnualIncrease: "",
      budget: "",
      status: "active",
    });

    setEditingGoal(null);
  };

  const openAddForm = () => {
    resetForm();

    setError("");
    setSuccess("");

    setShowForm(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setModalVisible(true);
      });
    });
  };

  const openEditForm = (goal) => {
    setEditingGoal(goal);

    setFormData({
      name: goal.name || "",
      goalType: goal.goalType || "",
      targetAmount: goal.targetAmount || "",
      currentSavings: goal.currentSavings || "",
      targetDate: goal.targetDate
        ? new Date(goal.targetDate)
            .toISOString()
            .split("T")[0]
        : "",
      expectedAnnualIncrease:
        goal.expectedAnnualIncrease || "",
      budget: goal.budget || "",
      status: goal.status || "active",
    });

    setError("");
    setSuccess("");

    setShowForm(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setModalVisible(true);
      });
    });
  };

  const closeForm = () => {
    if (submitting) {
      return;
    }

    setModalVisible(false);

    setTimeout(() => {
      setShowForm(false);
      resetForm();
    }, 450);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Goal name is required.";
    }

    if (!formData.goalType.trim()) {
      return "Goal type is required.";
    }

    if (
      !formData.targetAmount ||
      Number(formData.targetAmount) <= 0
    ) {
      return "Target amount must be greater than zero.";
    }

    if (Number(formData.currentSavings || 0) < 0) {
      return "Current savings cannot be negative.";
    }

    if (
      Number(formData.currentSavings || 0) >
      Number(formData.targetAmount)
    ) {
      return "Current savings cannot be greater than the target amount.";
    }

    if (
      Number(formData.expectedAnnualIncrease || 0) < 0
    ) {
      return "Expected annual increase cannot be negative.";
    }

    return "";
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

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
        goalType: formData.goalType.trim(),
        targetAmount: Number(formData.targetAmount),
        currentSavings: Number(
          formData.currentSavings || 0
        ),
        targetDate: formData.targetDate || null,
        expectedAnnualIncrease: Number(
          formData.expectedAnnualIncrease || 0
        ),
        budget: formData.budget.trim()
          ? formData.budget.trim()
          : null,
      };

      if (editingGoal) {
        payload.status = formData.status;

        await api.put(
          `/savings-goals/${editingGoal._id}`,
          payload
        );

        setSuccess(
          "Savings goal updated successfully."
        );
      } else {
        await api.post(
          "/savings-goals",
          payload
        );

        setSuccess(
          "Savings goal created successfully."
        );
      }

      setModalVisible(false);

      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 400);

      await fetchGoals();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save savings goal."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (goal) => {
    const confirmed = window.confirm(
      `Delete "${goal.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/savings-goals/${goal._id}`
      );

      setSuccess(
        "Savings goal deleted successfully."
      );

      await fetchGoals();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete savings goal."
      );
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not set";
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

  const getProgress = (percentage) => {
    return Math.min(
      Math.max(Number(percentage) || 0, 0),
      100
    );
  };

  const getTargetStatusLabel = (status) => {
    if (status === "completed") {
      return "Completed";
    }

    if (status === "onTrack") {
      return "On Track";
    }

    if (status === "behind") {
      return "Behind";
    }

    return "Calculating";
  };

  const getTargetStatusIcon = (status) => {
    if (status === "completed") {
      return <CheckCircle size={17} />;
    }

    if (status === "behind") {
      return <CircleAlert size={17} />;
    }

    if (status === "onTrack") {
      return <CheckCircle size={17} />;
    }

    return <AlertTriangle size={17} />;
  };

  const getStatusStyles = (status) => {
    if (status === "completed") {
      return `
        border-emerald-200/80
        bg-gradient-to-r
        from-emerald-50/90
        to-green-50/70
        text-emerald-700
        dark:border-emerald-400/20
        dark:from-emerald-950/40
        dark:to-green-950/20
        dark:text-emerald-300
      `;
    }

    if (status === "behind") {
      return `
        border-red-200/80
        bg-gradient-to-r
        from-red-50/90
        to-rose-50/70
        text-red-700
        dark:border-red-400/20
        dark:from-red-950/40
        dark:to-rose-950/20
        dark:text-red-300
      `;
    }

    if (status === "onTrack") {
      return `
        border-emerald-200/80
        bg-gradient-to-r
        from-emerald-50/90
        to-teal-50/70
        text-emerald-700
        dark:border-emerald-400/20
        dark:from-emerald-950/40
        dark:to-teal-950/20
        dark:text-emerald-300
      `;
    }

    return `
      border-amber-200/80
      bg-gradient-to-r
      from-amber-50/90
      to-yellow-50/70
      text-amber-700
      dark:border-amber-400/20
      dark:from-amber-950/40
      dark:to-yellow-950/20
      dark:text-amber-300
    `;
  };

  const totalTarget = goals.reduce(
    (total, goal) =>
      total + Number(goal.targetAmount || 0),
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) =>
      total + Number(goal.currentSavings || 0),
    0
  );

  const totalRemaining = goals.reduce(
    (total, goal) =>
      total + Number(goal.remainingAmount || 0),
    0
  );

  /* =========================================================
     INPUT CLASS
  ========================================================= */

  const inputClass = `
    h-11
    w-full
    rounded-2xl
    border
    border-white/80
    bg-white/65
    px-4
    text-sm
    font-bold
    text-[var(--text-h)]
    outline-none
    shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
    backdrop-blur-xl
    transition-all
    duration-300
    placeholder:text-slate-400
    hover:border-violet-200
    focus:border-violet-400
    focus:bg-white/85
    focus:ring-4
    focus:ring-violet-500/10
    dark:border-white/10
    dark:bg-white/5
    dark:placeholder:text-slate-500
    dark:hover:border-violet-400/30
    dark:focus:border-violet-400/60
    dark:focus:bg-white/10
  `;

  const labelClass = `
    mb-1.5
    block
    text-xs
    font-extrabold
    text-[var(--text-h)]
  `;

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div
      className="
        min-h-full
        w-full
        px-4
        py-5
        sm:px-6
        lg:px-8
      "
    >
      <div className="mx-auto w-full max-w-[1500px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            rounded-[28px]
            border
            border-white/80
            bg-gradient-to-br
            from-white/90
            via-white/75
            to-violet-50/70
            p-6
            shadow-[0_18px_45px_rgba(20,24,31,0.07)]
            backdrop-blur-xl
            dark:border-white/10
            dark:from-slate-900/90
            dark:via-slate-900/75
            dark:to-violet-950/30
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                mb-1
                text-[11px]
                font-extrabold
                uppercase
                tracking-[0.18em]
                text-violet-600
                dark:text-violet-300
              "
            >
              SAVINGS
            </div>

            <h1
              className="
                m-0
                text-3xl
                font-extrabold
                tracking-tight
                text-[var(--text-h)]
                sm:text-4xl
              "
            >
              Savings Goals
            </h1>

            <p
              className="
                mt-1.5
                text-sm
                font-bold
                text-[var(--text)]
              "
            >
              Set financial goals and track your
              progress toward them.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              border-violet-300/40
              bg-gradient-to-br
              from-violet-500
              via-purple-600
              to-fuchsia-600
              px-5
              py-3
              text-sm
              font-extrabold
              text-white
              shadow-[0_12px_30px_rgba(124,58,237,0.25)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_18px_38px_rgba(124,58,237,0.32)]
              active:translate-y-0
            "
          >
            <Plus size={18} />
            Add Goal
          </button>
        </div>

        {/* =================================================
            MESSAGES
        ================================================= */}

        {error && (
          <div
            className="
              mb-5
              rounded-2xl
              border
              border-red-200/80
              bg-gradient-to-r
              from-red-50/90
              to-rose-50/70
              px-5
              py-3.5
              text-sm
              font-extrabold
              text-red-700
              shadow-sm
              backdrop-blur-xl
              dark:border-red-400/20
              dark:from-red-950/40
              dark:to-rose-950/20
              dark:text-red-300
            "
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="
              mb-5
              rounded-2xl
              border
              border-emerald-200/80
              bg-gradient-to-r
              from-emerald-50/90
              to-green-50/70
              px-5
              py-3.5
              text-sm
              font-extrabold
              text-emerald-700
              shadow-sm
              backdrop-blur-xl
              dark:border-emerald-400/20
              dark:from-emerald-950/40
              dark:to-green-950/20
              dark:text-emerald-300
            "
          >
            {success}
          </div>
        )}

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div
          className="
            mb-6
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >
          {/* Total Target */}

          <div
            className="
              rounded-[24px]
              border
              border-violet-200/70
              bg-gradient-to-br
              from-violet-50/95
              via-white/80
              to-purple-100/60
              p-5
              shadow-[0_14px_35px_rgba(124,58,237,0.08)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-0.5
              dark:border-violet-400/20
              dark:from-violet-950/40
              dark:via-slate-900/75
              dark:to-purple-950/30
            "
          >
            <div
              className="
                mb-4
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                border
                border-violet-200/70
                bg-white/65
                text-violet-600
                shadow-sm
                backdrop-blur-xl
                dark:border-violet-400/20
                dark:bg-white/5
                dark:text-violet-300
              "
            >
              <PiggyBank size={21} />
            </div>

            <span
              className="
                block
                text-[11px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-violet-600
                dark:text-violet-300
              "
            >
              Total Target
            </span>

            <strong
              className="
                mt-1
                block
                text-2xl
                font-extrabold
                tracking-tight
                text-[var(--text-h)]
              "
            >
              {formatCurrency(totalTarget)}
            </strong>
          </div>

          {/* Total Saved */}

          <div
            className="
              rounded-[24px]
              border
              border-emerald-200/70
              bg-gradient-to-br
              from-emerald-50/95
              via-white/80
              to-green-100/60
              p-5
              shadow-[0_14px_35px_rgba(34,160,107,0.08)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-0.5
              dark:border-emerald-400/20
              dark:from-emerald-950/40
              dark:via-slate-900/75
              dark:to-green-950/30
            "
          >
            <div
              className="
                mb-4
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                border
                border-emerald-200/70
                bg-white/65
                text-emerald-600
                shadow-sm
                backdrop-blur-xl
                dark:border-emerald-400/20
                dark:bg-white/5
                dark:text-emerald-300
              "
            >
              <PiggyBank size={21} />
            </div>

            <span
              className="
                block
                text-[11px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-emerald-600
                dark:text-emerald-300
              "
            >
              Total Saved
            </span>

            <strong
              className="
                mt-1
                block
                text-2xl
                font-extrabold
                tracking-tight
                text-[var(--text-h)]
              "
            >
              {formatCurrency(totalSaved)}
            </strong>
          </div>

          {/* Remaining */}

          <div
            className="
              rounded-[24px]
              border
              border-sky-200/70
              bg-gradient-to-br
              from-sky-50/95
              via-white/80
              to-blue-100/60
              p-5
              shadow-[0_14px_35px_rgba(59,130,246,0.08)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-0.5
              dark:border-sky-400/20
              dark:from-sky-950/40
              dark:via-slate-900/75
              dark:to-blue-950/30
            "
          >
            <div
              className="
                mb-4
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                border
                border-sky-200/70
                bg-white/65
                text-sky-600
                shadow-sm
                backdrop-blur-xl
                dark:border-sky-400/20
                dark:bg-white/5
                dark:text-sky-300
              "
            >
              <PiggyBank size={21} />
            </div>

            <span
              className="
                block
                text-[11px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-sky-600
                dark:text-sky-300
              "
            >
              Remaining
            </span>

            <strong
              className="
                mt-1
                block
                text-2xl
                font-extrabold
                tracking-tight
                text-[var(--text-h)]
              "
            >
              {formatCurrency(totalRemaining)}
            </strong>
          </div>
        </div>

        {/* =================================================
            LOADING / EMPTY / GOALS
        ================================================= */}

        {loading ? (
          <div
            className="
              rounded-[28px]
              border
              border-white/80
              bg-white/70
              p-12
              text-center
              text-sm
              font-extrabold
              text-[var(--text)]
              shadow-[0_16px_40px_rgba(20,24,31,0.06)]
              backdrop-blur-xl
              dark:border-white/10
              dark:bg-slate-900/60
            "
          >
            Loading savings goals...
          </div>
        ) : goals.length === 0 ? (
          <div
            className="
              rounded-[28px]
              border
              border-white/80
              bg-gradient-to-br
              from-white/90
              via-white/75
              to-violet-50/60
              px-6
              py-16
              text-center
              shadow-[0_18px_45px_rgba(20,24,31,0.07)]
              backdrop-blur-xl
              dark:border-white/10
              dark:from-slate-900/90
              dark:via-slate-900/75
              dark:to-violet-950/30
            "
          >
            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-3xl
                border
                border-violet-200/70
                bg-violet-50/80
                text-violet-600
                dark:border-violet-400/20
                dark:bg-violet-950/40
                dark:text-violet-300
              "
            >
              <PiggyBank size={30} />
            </div>

            <h2
              className="
                m-0
                text-2xl
                font-extrabold
                text-[var(--text-h)]
              "
            >
              No savings goals yet
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                font-bold
                text-[var(--text)]
              "
            >
              Create your first goal and start
              tracking your savings progress.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-gradient-to-br
                from-violet-500
                via-purple-600
                to-fuchsia-600
                px-5
                py-3
                text-sm
                font-extrabold
                text-white
                shadow-[0_12px_30px_rgba(124,58,237,0.25)]
                transition-all
                duration-300
                hover:-translate-y-0.5
              "
            >
              <Plus size={18} />
              Create Goal
            </button>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              xl:grid-cols-2
            "
          >
            {goals.map((goal) => {
              const progress = getProgress(
                goal.progressPercentage
              );

              return (
                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/80
                    bg-gradient-to-br
                    from-white/90
                    via-white/75
                    to-violet-50/60
                    p-6
                    shadow-[0_18px_45px_rgba(20,24,31,0.07)]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_24px_55px_rgba(20,24,31,0.10)]
                    dark:border-white/10
                    dark:from-slate-900/90
                    dark:via-slate-900/75
                    dark:to-violet-950/25
                  "
                  key={goal._id}
                >
                  {/* Decorative glow */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-16
                      -top-16
                      h-40
                      w-40
                      rounded-full
                      bg-violet-400/10
                      blur-3xl
                      transition-all
                      duration-500
                      group-hover:bg-violet-400/20
                    "
                  />

                  {/* Card Header */}

                  <div
                    className="
                      relative
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <div className="min-w-0">
                      <div
                        className="
                          mb-1
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-[0.16em]
                          text-violet-600
                          dark:text-violet-300
                        "
                      >
                        SAVINGS GOAL
                      </div>

                      <h2
                        className="
                          m-0
                          truncate
                          text-xl
                          font-extrabold
                          tracking-tight
                          text-[var(--text-h)]
                        "
                      >
                        {goal.name}
                      </h2>

                      <p
                        className="
                          mt-1
                          text-xs
                          font-bold
                          text-[var(--text)]
                        "
                      >
                        {goal.goalType}
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        shrink-0
                        gap-2
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(goal)
                        }
                        title="Edit goal"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-slate-200/80
                          bg-white/60
                          text-slate-600
                          shadow-sm
                          backdrop-blur-xl
                          transition-all
                          duration-300
                          hover:border-violet-300
                          hover:bg-violet-50
                          hover:text-violet-600
                          dark:border-white/10
                          dark:bg-white/5
                          dark:text-slate-300
                          dark:hover:bg-violet-950/40
                          dark:hover:text-violet-300
                        "
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(goal)
                        }
                        title="Delete goal"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-red-200/70
                          bg-white/60
                          text-red-500
                          shadow-sm
                          backdrop-blur-xl
                          transition-all
                          duration-300
                          hover:border-red-300
                          hover:bg-red-50
                          hover:text-red-600
                          dark:border-red-400/20
                          dark:bg-white/5
                          dark:text-red-300
                          dark:hover:bg-red-950/40
                        "
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}

                  <div
                    className="
                      relative
                      mt-6
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >
                    <div
                      className="
                        rounded-2xl
                        border
                        border-emerald-200/60
                        bg-gradient-to-br
                        from-emerald-50/80
                        to-white/60
                        p-4
                        backdrop-blur-xl
                        dark:border-emerald-400/15
                        dark:from-emerald-950/30
                        dark:to-white/5
                      "
                    >
                      <span
                        className="
                          block
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-[0.1em]
                          text-emerald-600
                          dark:text-emerald-300
                        "
                      >
                        Saved
                      </span>

                      <strong
                        className="
                          mt-1
                          block
                          text-lg
                          font-extrabold
                          text-[var(--text-h)]
                        "
                      >
                        {formatCurrency(
                          goal.currentSavings
                        )}
                      </strong>
                    </div>

                    <div
                      className="
                        rounded-2xl
                        border
                        border-violet-200/60
                        bg-gradient-to-br
                        from-violet-50/80
                        to-white/60
                        p-4
                        backdrop-blur-xl
                        dark:border-violet-400/15
                        dark:from-violet-950/30
                        dark:to-white/5
                      "
                    >
                      <span
                        className="
                          block
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-[0.1em]
                          text-violet-600
                          dark:text-violet-300
                        "
                      >
                        Target
                      </span>

                      <strong
                        className="
                          mt-1
                          block
                          text-lg
                          font-extrabold
                          text-[var(--text-h)]
                        "
                      >
                        {formatCurrency(
                          goal.targetAmount
                        )}
                      </strong>
                    </div>
                  </div>

                  {/* Progress */}

                  <div className="relative mt-5">
                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        justify-between
                        gap-3
                        text-xs
                        font-extrabold
                        text-[var(--text)]
                      "
                    >
                      <span>
                        {progress.toFixed(0)}%
                        complete
                      </span>

                      <span>
                        {formatCurrency(
                          goal.remainingAmount
                        )}{" "}
                        remaining
                      </span>
                    </div>

                    <div
                      className="
                        h-3
                        overflow-hidden
                        rounded-full
                        border
                        border-violet-100
                        bg-violet-50/80
                        dark:border-white/10
                        dark:bg-white/5
                      "
                    >
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-violet-500
                          via-purple-500
                          to-fuchsia-500
                          shadow-[0_0_14px_rgba(139,92,246,0.35)]
                          transition-all
                          duration-700
                        "
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Details */}

                  <div
                    className="
                      relative
                      mt-5
                      grid
                      grid-cols-1
                      gap-3
                      sm:grid-cols-3
                    "
                  >
                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200/70
                        bg-white/50
                        p-3
                        backdrop-blur-xl
                        dark:border-white/10
                        dark:bg-white/5
                      "
                    >
                      <span
                        className="
                          block
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-[0.08em]
                          text-[var(--text)]
                        "
                      >
                        Target Date
                      </span>

                      <strong
                        className="
                          mt-1
                          block
                          text-xs
                          font-extrabold
                          text-[var(--text-h)]
                        "
                      >
                        {formatDate(
                          goal.targetDate
                        )}
                      </strong>
                    </div>

                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200/70
                        bg-white/50
                        p-3
                        backdrop-blur-xl
                        dark:border-white/10
                        dark:bg-white/5
                      "
                    >
                      <span
                        className="
                          block
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-[0.08em]
                          text-[var(--text)]
                        "
                      >
                        Estimated
                      </span>

                      <strong
                        className="
                          mt-1
                          block
                          text-xs
                          font-extrabold
                          text-[var(--text-h)]
                        "
                      >
                        {goal.estimatedMonthsRemaining !==
                          null &&
                        goal.estimatedMonthsRemaining !==
                          undefined
                          ? `${goal.estimatedMonthsRemaining} months`
                          : "Calculating"}
                      </strong>
                    </div>

                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200/70
                        bg-white/50
                        p-3
                        backdrop-blur-xl
                        dark:border-white/10
                        dark:bg-white/5
                      "
                    >
                      <span
                        className="
                          block
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-[0.08em]
                          text-[var(--text)]
                        "
                      >
                        Status
                      </span>

                      <strong
                        className="
                          mt-1
                          block
                          text-xs
                          font-extrabold
                          capitalize
                          text-[var(--text-h)]
                        "
                      >
                        {goal.status}
                      </strong>
                    </div>
                  </div>

                  {/* Estimated Completion */}

                  {goal.estimatedCompletionDate && (
                    <div
                      className="
                        relative
                        mt-4
                        rounded-2xl
                        border
                        border-sky-200/70
                        bg-gradient-to-r
                        from-sky-50/80
                        to-blue-50/60
                        px-4
                        py-3
                        text-xs
                        font-bold
                        text-sky-700
                        dark:border-sky-400/20
                        dark:from-sky-950/30
                        dark:to-blue-950/20
                        dark:text-sky-300
                      "
                    >
                      Estimated completion:{" "}
                      <strong>
                        {formatDate(
                          goal.estimatedCompletionDate
                        )}
                      </strong>
                    </div>
                  )}

                  {/* Projected Target */}

                  {Number(
                    goal.projectedTargetAmount
                  ) >
                    Number(goal.targetAmount) && (
                    <div
                      className="
                        relative
                        mt-3
                        rounded-2xl
                        border
                        border-amber-200/70
                        bg-gradient-to-r
                        from-amber-50/80
                        to-yellow-50/60
                        px-4
                        py-3
                        text-xs
                        font-bold
                        text-amber-700
                        dark:border-amber-400/20
                        dark:from-amber-950/30
                        dark:to-yellow-950/20
                        dark:text-amber-300
                      "
                    >
                      Projected future cost:{" "}
                      <strong>
                        {formatCurrency(
                          goal.projectedTargetAmount
                        )}
                      </strong>
                    </div>
                  )}

                  {/* Target Status */}

                  <div
                    className={`
                      relative
                      mt-4
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      border
                      px-4
                      py-3
                      text-xs
                      font-extrabold
                      ${getStatusStyles(
                        goal.targetStatus
                      )}
                    `}
                  >
                    {getTargetStatusIcon(
                      goal.targetStatus
                    )}

                    <span>
                      {getTargetStatusLabel(
                        goal.targetStatus
                      )}
                    </span>
                  </div>

                  {/* Insight */}

                  {goal.insight && (
                    <div
                      className="
                        relative
                        mt-4
                        rounded-2xl
                        border
                        border-violet-200/60
                        bg-gradient-to-br
                        from-violet-50/70
                        via-white/50
                        to-fuchsia-50/60
                        p-4
                        backdrop-blur-xl
                        dark:border-violet-400/15
                        dark:from-violet-950/30
                        dark:via-white/5
                        dark:to-fuchsia-950/20
                      "
                    >
                      {goal.insight.title && (
                        <strong
                          className="
                            block
                            text-xs
                            font-extrabold
                            text-violet-700
                            dark:text-violet-300
                          "
                        >
                          {goal.insight.title}
                        </strong>
                      )}

                      {goal.insight.message && (
                        <p
                          className="
                            mt-1.5
                            text-xs
                            font-bold
                            leading-5
                            text-[var(--text)]
                          "
                        >
                          {goal.insight.message}
                        </p>
                      )}

                      {goal.insight.punchline && (
                        <span
                          className="
                            mt-2
                            block
                            text-[11px]
                            font-extrabold
                            text-[var(--text-h)]
                          "
                        >
                          {goal.insight.punchline}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================
            ADD / EDIT MODAL
        ================================================= */}

        {showForm && (
          <div
            className={`
              fixed
              left-0
              right-0
              top-[115px]
              bottom-0
              z-[100]
              flex
              items-center
              justify-center
              overflow-hidden
              px-4
              py-6
              transition-all
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                modalVisible
                  ? "bg-slate-950/35 backdrop-blur-md"
                  : "bg-slate-950/0 backdrop-blur-0"
              }
            `}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeForm();
              }
            }}
          >
            {/* =================================================
                MODAL
            ================================================= */}

            <div
              className={`
                relative
                flex
                w-full
                max-w-[540px]
                max-h-[calc(100vh-155px)]
                flex-col
                overflow-hidden
                rounded-[28px]
                border
                border-white/75
                bg-white/72
                shadow-[0_30px_90px_rgba(15,23,42,0.28)]
                backdrop-blur-2xl
                transition-all
                duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]
                dark:border-white/15
                dark:bg-slate-900/75
                dark:shadow-[0_30px_90px_rgba(0,0,0,0.55)]
                ${
                  modalVisible
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-8 scale-[0.96] opacity-0"
                }
              `}
              onMouseDown={(e) =>
                e.stopPropagation()
              }
            >
              {/* Modal glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-52
                  w-52
                  rounded-full
                  bg-violet-400/20
                  blur-3xl
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  left-1/2
                  h-52
                  w-52
                  -translate-x-1/2
                  rounded-full
                  bg-fuchsia-400/10
                  blur-3xl
                "
              />

              {/* =================================================
                  MODAL HEADER
              ================================================= */}

              <div
                className="
                  relative
                  flex
                  shrink-0
                  items-start
                  justify-between
                  gap-4
                  border-b
                  border-slate-200/70
                  px-6
                  py-4
                  dark:border-white/10
                "
              >
                <div>
                  <div
                    className="
                      mb-1
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-[0.18em]
                      text-violet-600
                      dark:text-violet-300
                    "
                  >
                    {editingGoal
                      ? "EDIT GOAL"
                      : "NEW GOAL"}
                  </div>

                  <h2
                    className="
                      m-0
                      text-xl
                      font-extrabold
                      tracking-tight
                      text-[var(--text-h)]
                    "
                  >
                    {editingGoal
                      ? "Edit Savings Goal"
                      : "Create Savings Goal"}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-bold
                      text-[var(--text)]
                    "
                  >
                    Define what you're saving for and
                    track your progress.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200/80
                    bg-white/70
                    text-slate-600
                    shadow-sm
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:rotate-90
                    hover:bg-white
                    hover:text-violet-600
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-slate-300
                    dark:hover:bg-white/10
                    dark:hover:text-violet-300
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* =================================================
                  SCROLLABLE FORM
              ================================================= */}

              <div
                className="
                  relative
                  min-h-0
                  flex-1
                  overflow-y-auto
                  px-6
                  py-5
                "
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Goal Name */}

                  <div>
                    <label
                      htmlFor="goal-name"
                      className={labelClass}
                    >
                      Goal Name
                    </label>

                    <input
                      id="goal-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. New Laptop"
                      className={inputClass}
                    />
                  </div>

                  {/* Goal Type */}

                  <div>
                    <label
                      htmlFor="goal-type"
                      className={labelClass}
                    >
                      Goal Type
                    </label>

                    <input
                      id="goal-type"
                      name="goalType"
                      type="text"
                      value={formData.goalType}
                      onChange={handleChange}
                      placeholder="e.g. Travel, Car, Education"
                      className={inputClass}
                    />
                  </div>

                  {/* Target + Current */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-4
                      sm:grid-cols-2
                    "
                  >
                    <div>
                      <label
                        htmlFor="target-amount"
                        className={labelClass}
                      >
                        Target Amount
                      </label>

                      <div className="relative">
                        <span
                          className="
                            pointer-events-none
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-sm
                            font-extrabold
                            text-violet-600
                            dark:text-violet-300
                          "
                        >
                          ₹
                        </span>

                        <input
                          id="target-amount"
                          name="targetAmount"
                          type="number"
                          min="1"
                          step="0.01"
                          value={
                            formData.targetAmount
                          }
                          onChange={handleChange}
                          placeholder="e.g. 60000"
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="current-savings"
                        className={labelClass}
                      >
                        Current Savings
                      </label>

                      <div className="relative">
                        <span
                          className="
                            pointer-events-none
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-sm
                            font-extrabold
                            text-emerald-600
                            dark:text-emerald-300
                          "
                        >
                          ₹
                        </span>

                        <input
                          id="current-savings"
                          name="currentSavings"
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            formData.currentSavings
                          }
                          onChange={handleChange}
                          placeholder="e.g. 15000"
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Target Date */}

                  <div>
                    <label
                      htmlFor="target-date"
                      className={labelClass}
                    >
                      Target Date
                    </label>

                    <div
                      className="
                        relative
                        rounded-2xl
                        border
                        border-white/80
                        bg-white/65
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        focus-within:border-violet-400
                        focus-within:ring-4
                        focus-within:ring-violet-500/10
                        dark:border-white/10
                        dark:bg-white/5
                      "
                    >
                      <Calendar
                        size={17}
                        className="
                          pointer-events-none
                          absolute
                          left-4
                          top-1/2
                          z-10
                          -translate-y-1/2
                          text-violet-600
                          dark:text-violet-300
                        "
                      />

                      <input
                        id="target-date"
                        name="targetDate"
                        type="date"
                        value={
                          formData.targetDate
                        }
                        onChange={handleChange}
                        className="
                          h-11
                          w-full
                          rounded-2xl
                          bg-transparent
                          pl-11
                          pr-4
                          text-sm
                          font-bold
                          text-[var(--text-h)]
                          outline-none
                          dark:[color-scheme:dark]
                        "
                      />
                    </div>
                  </div>

                  {/* Expected Annual Increase */}

                  <div>
                    <label
                      htmlFor="annual-increase"
                      className={labelClass}
                    >
                      Expected Annual Increase (%)
                    </label>

                    <div className="relative">
                      <input
                        id="annual-increase"
                        name="expectedAnnualIncrease"
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          formData.expectedAnnualIncrease
                        }
                        onChange={handleChange}
                        placeholder="e.g. 5"
                        className={`${inputClass} pr-10`}
                      />

                      <span
                        className="
                          pointer-events-none
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-sm
                          font-extrabold
                          text-[var(--text)]
                        "
                      >
                        %
                      </span>
                    </div>

                    <small
                      className="
                        mt-1.5
                        block
                        text-[11px]
                        font-bold
                        text-[var(--text)]
                      "
                    >
                      Useful for estimating future price
                      increases.
                    </small>
                  </div>

                  {/* Optional Budget */}

                  <div>
                    <label
                      htmlFor="goal-budget"
                      className={labelClass}
                    >
                      Budget ID (Optional)
                    </label>

                    <input
                      id="goal-budget"
                      name="budget"
                      type="text"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Optional budget ID"
                      className={inputClass}
                    />
                  </div>

                  {/* Status */}

                  {editingGoal && (
                    <div>
                      <label
                        htmlFor="goal-status"
                        className={labelClass}
                      >
                        Status
                      </label>

                      <select
                        id="goal-status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={`${inputClass} dark:[color-scheme:dark]`}
                      >
                        <option value="active">
                          Active
                        </option>

                        <option value="paused">
                          Paused
                        </option>

                        <option value="completed">
                          Completed
                        </option>
                      </select>
                    </div>
                  )}

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div
                    className="
                      flex
                      flex-col-reverse
                      gap-3
                      border-t
                      border-slate-200/70
                      pt-4
                      sm:flex-row
                      sm:justify-end
                      dark:border-white/10
                    "
                  >
                    <button
                      type="button"
                      onClick={closeForm}
                      disabled={submitting}
                      className="
                        rounded-2xl
                        border
                        border-slate-200/80
                        bg-white/65
                        px-5
                        py-2.5
                        text-sm
                        font-extrabold
                        text-[var(--text-h)]
                        shadow-sm
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        hover:bg-white
                        hover:-translate-y-0.5
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        dark:border-white/10
                        dark:bg-white/5
                        dark:hover:bg-white/10
                      "
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        border
                        border-violet-300/50
                        bg-gradient-to-br
                        from-violet-500
                        via-purple-600
                        to-fuchsia-600
                        px-6
                        py-2.5
                        text-sm
                        font-extrabold
                        text-white
                        shadow-[0_12px_30px_rgba(124,58,237,0.25)]
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:shadow-[0_18px_38px_rgba(124,58,237,0.32)]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {submitting
                        ? "Saving..."
                        : editingGoal
                        ? "Update Goal"
                        : "Create Goal"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavingsGoals;