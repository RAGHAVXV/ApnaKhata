import { useEffect, useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Receipt,
  PiggyBank,
  Utensils,
  ShoppingBag,
  Car,
  FileText,
  Clapperboard,
  HeartPulse,
  BookOpen,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleDollarSign,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import api from "../services/api";


// ======================================================
// CATEGORY ICONS
// ======================================================

const categoryIcons = {
  Food: Utensils,
  Shopping: ShoppingBag,
  Transport: Car,
  Bills: FileText,
  Entertainment: Clapperboard,
  Health: HeartPulse,
  Education: BookOpen,
  Salary: Wallet,
  Business: BriefcaseBusiness,
  Investment: ChartNoAxesCombined,
  Other: CircleDollarSign,
};


// ======================================================
// DASHBOARD
// ======================================================

function Dashboard() {
  const [data, setData] = useState(null);
  const [trendData, setTrendData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [error, setError] = useState("");

  // ====================================================
  // USER
  // ====================================================

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userName = storedUser?.name || "User";

  // ====================================================
  // FORMAT AMOUNT
  // ====================================================

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  // ====================================================
  // LOCAL DATE KEY
  // ====================================================

  const getLocalDateKey = (dateValue) => {
    const date = new Date(dateValue);

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ====================================================
  // BUILD 7-DAY TREND
  // ====================================================

  const buildTrendData = (transactions) => {
    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const days = [];

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);

      date.setDate(
        today.getDate() - i
      );

      days.push({
        key: getLocalDateKey(date),

        label: date.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          }
        ),

        income: 0,
        expense: 0,
      });
    }

    const dayMap = {};

    days.forEach((day) => {
      dayMap[day.key] = day;
    });

    transactions.forEach((transaction) => {
      const key = getLocalDateKey(
        transaction.date
      );

      if (!dayMap[key]) {
        return;
      }

      const amount = Number(
        transaction.amount || 0
      );

      if (transaction.type === "income") {
        dayMap[key].income += amount;
      }

      if (transaction.type === "expense") {
        dayMap[key].expense += amount;
      }
    });

    return days;
  };

  // ====================================================
  // FETCH DASHBOARD
  // ====================================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          summaryResponse,
          transactionsResponse,
        ] = await Promise.all([
          api.get("/dashboard/summary"),

          api.get("/transactions", {
            params: {
              limit: 100,
              sort: "oldest",
            },
          }),
        ]);

        setData(summaryResponse.data);

        const transactions =
          transactionsResponse.data
            ?.transactions || [];

        setTrendData(
          buildTrendData(transactions)
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
        setTrendLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3

            rounded-2xl
            border
            border-slate-200

            bg-white/80
            px-6
            py-4

            text-sm
            font-semibold
            text-slate-600

            shadow-[0_15px_40px_rgba(20,24,31,0.06)]

            backdrop-blur-xl

            dark:border-white/10
            dark:bg-[#15151d]/80
            dark:text-slate-300
          "
        >
          <div
            className="
              h-5
              w-5
              animate-spin
              rounded-full
              border-2
              border-purple-200
              border-t-purple-600

              dark:border-purple-900
              dark:border-t-purple-400
            "
          />

          <span>
            Loading your financial overview...
          </span>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          px-6
        "
      >
        <div
          className="
            max-w-md

            rounded-2xl
            border
            border-red-200

            bg-red-50

            px-6
            py-5

            text-center
            text-sm
            font-semibold
            text-red-600

            dark:border-red-400/20
            dark:bg-red-500/10
            dark:text-red-400
          "
        >
          {error}
        </div>
      </div>
    );
  }

  // ====================================================
  // DATA
  // ====================================================

  const totalIncome =
    Number(data?.totalIncome || 0);

  const totalExpense =
    Number(data?.totalExpense || 0);

  const balance =
    Number(data?.balance || 0);

  const totalTransactions =
    Number(
      data?.totalTransactions || 0
    );

  const expenseCategories =
    Object.entries(
      data?.expenseByCategory || {}
    ).sort(
      ([, first], [, second]) =>
        Number(second) - Number(first)
    );

  const recentTransactions =
    data?.recentTransactions || [];

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[1500px]

        space-y-7

        pb-12
      "
    >

      {/* ==================================================
          WELCOME
      ================================================== */}

      <section
        className="
          relative
          overflow-hidden

          rounded-[28px]

          border
          border-slate-200/80

          bg-white/65

          px-7
          py-6

          shadow-[0_18px_50px_rgba(20,24,31,0.055)]

          backdrop-blur-2xl

          transition-all
          duration-300

          dark:border-white/[0.08]
          dark:bg-[#15151d]/60
          dark:shadow-[0_18px_50px_rgba(0,0,0,0.20)]

          sm:px-9
          sm:py-6
        "
      >

        {/* Decorative glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24

            h-64
            w-64

            rounded-full

            bg-purple-300/20

            blur-3xl

            dark:bg-purple-500/10
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-28
            left-1/3

            h-52
            w-52

            rounded-full

            bg-purple-200/10

            blur-3xl

            dark:bg-purple-500/5
          "
        />

        <div className="relative z-10">
  <p
    className="
      text-base
      font-bold
      leading-none
      tracking-[-0.2px]
      text-slate-700
      dark:text-slate-300
    "
  >
    Welcome back,
  </p>

  <h1
    className="
      mt-1
      font-[Manrope]
      text-5xl
      font-black
      leading-[0.9]
      tracking-[-2.6px]
      text-purple-700
      dark:text-purple-300
      sm:text-[56px]
    "
  >
    {userName}
  </h1>
</div>
      </section>


      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <section
        className="
          grid
          grid-cols-1
          gap-4

          sm:grid-cols-2

          xl:grid-cols-4
        "
      >

        {/* BALANCE */}

        <div
          className="
            group
            relative
            overflow-hidden

            rounded-[24px]
            border

            border-purple-200/70

            bg-gradient-to-br
            from-purple-100/95
            via-purple-50/55
            to-white

            p-6

            shadow-[0_16px_40px_rgba(141,123,216,0.10)]

            transition-all
            duration-300

            hover:-translate-y-1
            hover:shadow-[0_20px_45px_rgba(141,123,216,0.15)]

            dark:border-purple-400/15
            dark:from-purple-500/10
            dark:via-[#15151d]
            dark:to-[#15151d]

            dark:hover:shadow-[0_20px_45px_rgba(141,123,216,0.10)]
          "
        >

          <div
            className="
              absolute
              -right-10
              -top-10

              h-28
              w-28

              rounded-full

              bg-purple-300/20

              blur-2xl

              dark:bg-purple-500/10
            "
          />

          <div
            className="
              relative
              flex
              items-start
              justify-between
            "
          >

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.12em]

                  text-purple-600

                  dark:text-purple-300
                "
              >
                Balance
              </p>

              <p
                className="
                  mt-4

                  text-3xl
                  font-extrabold
                  tracking-[-1.2px]

                  text-slate-950

                  dark:text-white
                "
              >
                ₹{formatAmount(balance)}
              </p>

              <p
                className="
                  mt-1

                  text-xs
                  font-bold

                  text-slate-700

                  dark:text-slate-400
                "
              >
                Available balance
              </p>
            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-2xl

                border
                border-purple-200

                bg-purple-100

                text-purple-600

                dark:border-purple-400/20
                dark:bg-purple-500/10
                dark:text-purple-300
              "
            >
              <Wallet
                size={21}
                strokeWidth={2}
              />
            </div>

          </div>
        </div>


        {/* INCOME */}

        <div
          className="
            group

            rounded-[24px]
            border

            border-emerald-200/80

            bg-gradient-to-br
            from-emerald-100/90
            via-emerald-50/45
            to-white

            p-6

            shadow-[0_16px_40px_rgba(20,24,31,0.045)]

            transition-all
            duration-300

            hover:-translate-y-1
            hover:shadow-[0_20px_45px_rgba(20,24,31,0.08)]

            dark:border-emerald-400/20
            dark:from-emerald-500/15
            dark:via-[#15151d]
            dark:to-[#15151d]
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.12em]

                  text-emerald-600

                  dark:text-emerald-300
                "
              >
                Total Income
              </p>

              <p
                className="
                  mt-4

                  text-3xl
                  font-extrabold
                  tracking-[-1.2px]

                  text-slate-950

                  dark:text-white
                "
              >
                ₹{formatAmount(totalIncome)}
              </p>

              <p
                className="
                  mt-1

                  text-xs
                  font-bold

                  text-slate-700

                  dark:text-slate-400
                "
              >
                Money received
              </p>
            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-2xl

                border
                border-emerald-200

                bg-emerald-50

                text-emerald-600

                dark:border-emerald-400/20
                dark:bg-emerald-500/10
                dark:text-emerald-300
              "
            >
              <ArrowUpRight
                size={21}
                strokeWidth={2}
              />
            </div>

          </div>
        </div>


        {/* EXPENSE */}

        <div
          className="
            group

            rounded-[24px]
            border

            border-red-200/80

            bg-gradient-to-br
            from-red-100/90
            via-red-50/45
            to-white

            p-6

            shadow-[0_16px_40px_rgba(20,24,31,0.045)]

            transition-all
            duration-300

            hover:-translate-y-1
            hover:shadow-[0_20px_45px_rgba(20,24,31,0.08)]

            dark:border-red-400/20
            dark:from-red-500/15
            dark:via-[#15151d]
            dark:to-[#15151d]
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.12em]

                  text-red-600

                  dark:text-red-300
                "
              >
                Total Expense
              </p>

              <p
                className="
                  mt-4

                  text-3xl
                  font-extrabold
                  tracking-[-1.2px]

                  text-slate-950

                  dark:text-white
                "
              >
                ₹{formatAmount(totalExpense)}
              </p>

              <p
                className="
                  mt-1

                  text-xs
                  font-bold

                  text-slate-700

                  dark:text-slate-400
                "
              >
                Money spent
              </p>
            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-2xl

                border
                border-red-200

                bg-red-50

                text-red-600

                dark:border-red-400/20
                dark:bg-red-500/10
                dark:text-red-300
              "
            >
              <ArrowDownRight
                size={21}
                strokeWidth={2}
              />
            </div>

          </div>
        </div>


        {/* TRANSACTIONS */}

        <div
          className="
            group

            rounded-[24px]
            border

            border-sky-200/80

            bg-gradient-to-br
            from-sky-100/75
            via-blue-50/35
            to-white

            p-6

            shadow-[0_16px_40px_rgba(20,24,31,0.045)]

            transition-all
            duration-300

            hover:-translate-y-1
            hover:shadow-[0_20px_45px_rgba(20,24,31,0.08)]

            dark:border-sky-400/15
            dark:from-sky-500/10
            dark:via-[#15151d]
            dark:to-[#15151d]
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.12em]

                  text-slate-500

                  dark:text-slate-400
                "
              >
                Transactions
              </p>

              <p
                className="
                  mt-4

                  text-3xl
                  font-extrabold
                  tracking-[-1.2px]

                  text-slate-950

                  dark:text-white
                "
              >
                {totalTransactions}
              </p>

              <p
                className="
                  mt-1

                  text-xs
                  font-bold

                  text-slate-700

                  dark:text-slate-400
                "
              >
                Total recorded activity
              </p>
            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-2xl

                border
                border-slate-200

                bg-slate-50

                text-slate-600

                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-slate-300
              "
            >
              <Receipt
                size={21}
                strokeWidth={2}
              />
            </div>

          </div>
        </div>

      </section>


      {/* ==================================================
          ANALYTICS
      ================================================== */}

      <section
        className="
          grid
          grid-cols-1
          gap-5

          xl:grid-cols-[minmax(0,1.7fr)_minmax(330px,0.8fr)]
        "
      >

        {/* =================================================
            7-DAY TREND
        ================================================= */}

        <div
          className="
            overflow-hidden

            rounded-[26px]
            border

            border-slate-200/80

            bg-white/70

            p-6

            shadow-[0_16px_45px_rgba(20,24,31,0.05)]

            backdrop-blur-xl

            transition-all
            duration-300

            dark:border-white/[0.08]
            dark:bg-[#15151d]/65
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4

              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >

            <div>

              <p
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.14em]

                  text-purple-600

                  dark:text-purple-300
                "
              >
                Last 7 Days
              </p>

              <h2
                className="
                  mt-1

                  text-xl
                  font-extrabold
                  tracking-[-0.6px]

                  text-slate-950

                  dark:text-white
                "
              >
                Income & Expense
              </h2>

              <p
                className="
                  mt-1

                  text-sm
                  font-semibold

                  text-slate-600

                  dark:text-slate-400
                "
              >
                Track how your money moved
                throughout the week.
              </p>

            </div>


            {/* LEGEND */}

            <div
              className="
                flex
                items-center
                gap-4

                text-xs
                font-semibold

                text-slate-500

                dark:text-slate-400
              "
            >

              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full

                    bg-emerald-400
                  "
                />

                Income
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full

                    bg-red-400
                  "
                />

                Expense
              </span>

            </div>

          </div>


          {/* CHART */}

          <div
            className="
              mt-6
              h-[310px]
              w-full
            "
          >

            {trendLoading ? (
              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-center

                  text-sm
                  font-semibold

                  text-slate-500

                  dark:text-slate-400
                "
              >
                Loading trend...
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={trendData}
                  margin={{
                    top: 12,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="4 5"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    stroke="var(--text)"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    stroke="var(--text)"
                    tickLine={false}
                    axisLine={false}
                    width={58}
                    tick={{
                      fontSize: 10,
                    }}
                    tickFormatter={(value) =>
                      value >= 1000
                        ? `₹${(
                            value / 1000
                          ).toFixed(0)}k`
                        : `₹${value}`
                    }
                  />

                  <Tooltip
                    cursor={{
                      stroke:
                        "var(--border)",
                    }}
                    contentStyle={{
                      background:
                        "var(--surface)",
                      border:
                        "1px solid var(--border)",
                      borderRadius:
                        "16px",
                      boxShadow:
                        "0 15px 35px rgba(20,24,31,0.12)",
                      color:
                        "var(--text-h)",
                    }}
                    labelStyle={{
                      color:
                        "var(--text-h)",
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                    formatter={(
                      value,
                      name
                    ) => [
                      `₹${formatAmount(
                        value
                      )}`,
                      name === "income"
                        ? "Income"
                        : "Expense",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="income"
                    name="income"
                    stroke="var(--green)"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      fill:
                        "var(--surface)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="expense"
                    name="expense"
                    stroke="var(--red)"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      fill:
                        "var(--surface)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>
            )}

          </div>

        </div>


        {/* =================================================
            SPENDING BY CATEGORY
        ================================================= */}

        <div
          className="
            overflow-hidden

            rounded-[26px]
            border

            border-slate-200/80

            bg-white/70

            p-6

            shadow-[0_16px_45px_rgba(20,24,31,0.05)]

            backdrop-blur-xl

            dark:border-white/[0.08]
            dark:bg-[#15151d]/65
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.14em]

                  text-purple-600

                  dark:text-purple-300
                "
              >
                Spending
              </p>

              <h2
                className="
                  mt-1

                  text-xl
                  font-extrabold
                  tracking-[-0.6px]

                  text-slate-950

                  dark:text-white
                "
              >
                By Category
              </h2>

              <p
                className="
                  mt-1

                  text-sm
                  font-semibold

                  text-slate-600

                  dark:text-slate-400
                "
              >
                Where your money is going.
              </p>

            </div>

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-2xl

                border
                border-purple-200

                bg-purple-50

                text-purple-600

                dark:border-purple-400/20
                dark:bg-purple-500/10
                dark:text-purple-300
              "
            >
              <PiggyBank
                size={19}
              />
            </div>

          </div>


          {/* CATEGORY LIST */}

          <div
            className="
              mt-6
              space-y-5
            "
          >

            {expenseCategories.length === 0 ? (

              <div
                className="
                  flex
                  min-h-[220px]
                  flex-col
                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-dashed
                  border-slate-200

                  bg-slate-50/60

                  text-center

                  dark:border-white/10
                  dark:bg-white/[0.02]
                "
              >

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center

                    rounded-2xl

                    bg-purple-50

                    text-purple-500

                    dark:bg-purple-500/10
                    dark:text-purple-300
                  "
                >
                  <CircleDollarSign
                    size={24}
                  />
                </div>

                <p
                  className="
                    mt-3

                    text-sm
                    font-bold

                    text-slate-700

                    dark:text-slate-300
                  "
                >
                  No expense data yet
                </p>

                <p
                  className="
                    mt-1

                    text-xs
                    font-bold

                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Your spending categories
                  will appear here.
                </p>

              </div>

            ) : (

              expenseCategories
                .slice(0, 6)
                .map(
                  ([category, amount]) => {

                    const Icon =
                      categoryIcons[
                        category
                      ] ||
                      MoreHorizontal;

                    const numericAmount =
                      Number(
                        amount || 0
                      );

                    const percentage =
                      totalExpense > 0
                        ? Math.min(
                            (
                              numericAmount /
                              totalExpense
                            ) *
                              100,
                            100
                          )
                        : 0;

                    return (
                      <div
                        key={category}
                        className="group"
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-4
                          "
                        >

                          <div
                            className="
                              flex
                              min-w-0
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center

                                rounded-xl

                                border
                                border-slate-200

                                bg-slate-50

                                text-slate-600

                                transition-colors
                                duration-200

                                group-hover:border-purple-200
                                group-hover:bg-purple-50
                                group-hover:text-purple-600

                                dark:border-white/10
                                dark:bg-white/[0.03]
                                dark:text-slate-300

                                dark:group-hover:border-purple-400/20
                                dark:group-hover:bg-purple-500/10
                                dark:group-hover:text-purple-300
                              "
                            >
                              <Icon
                                size={17}
                              />
                            </div>

                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-3
                                "
                              >

                                <span
                                  className="
                                    truncate

                                    text-sm
                                    font-bold

                                    text-slate-700

                                    dark:text-slate-200
                                  "
                                >
                                  {category}
                                </span>

                              </div>

                              <div
                                className="
                                  mt-2

                                  h-1.5
                                  w-full

                                  overflow-hidden

                                  rounded-full

                                  bg-slate-100

                                  dark:bg-white/[0.06]
                                "
                              >

                                <div
                                  className="
                                    h-full

                                    rounded-full

                                    bg-gradient-to-r
                                    from-purple-400
                                    to-purple-600

                                    transition-all
                                    duration-500
                                  "
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />

                              </div>

                            </div>

                          </div>

                          <span
                            className="
                              shrink-0

                              text-sm
                              font-extrabold

                              text-slate-900

                              dark:text-white
                            "
                          >
                            ₹
                            {formatAmount(
                              numericAmount
                            )}
                          </span>

                        </div>

                      </div>
                    );
                  }
                )

            )}

          </div>

        </div>

      </section>


      {/* ==================================================
          RECENT TRANSACTIONS
      ================================================== */}

      <section
        className="
          overflow-hidden

          rounded-[26px]
          border

          border-slate-200/80

          bg-white/70

          shadow-[0_16px_45px_rgba(20,24,31,0.05)]

          backdrop-blur-xl

          dark:border-white/[0.08]
          dark:bg-[#15151d]/65
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            gap-4

            border-b
            border-slate-200/80

            px-6
            py-6

            sm:flex-row
            sm:items-center
            sm:justify-between

            dark:border-white/[0.07]
          "
        >

          <div>

            <p
              className="
                text-[11px]
                font-extrabold
                uppercase
                tracking-[0.14em]

                text-purple-600

                dark:text-purple-300
              "
            >
              Activity
            </p>

            <h2
              className="
                mt-1

                text-xl
                font-extrabold
                tracking-[-0.6px]

                text-slate-950

                dark:text-white
              "
            >
              Recent Transactions
            </h2>

            <p
              className="
                mt-1

                text-sm
                font-bold

                text-slate-500

                dark:text-slate-400
              "
            >
              Your latest financial activity.
            </p>

          </div>

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-2xl

              border
              border-slate-200

              bg-slate-50

              text-slate-600

              dark:border-white/10
              dark:bg-white/[0.03]
              dark:text-slate-300
            "
          >
            <Receipt
              size={19}
            />
          </div>

        </div>


        {/* TRANSACTION LIST */}

        <div>

          {recentTransactions.length === 0 ? (

            <div
              className="
                flex
                min-h-[220px]
                flex-col
                items-center
                justify-center

                px-6
                py-12

                text-center
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-slate-200

                  bg-slate-50

                  text-slate-500

                  dark:border-white/10
                  dark:bg-white/[0.03]
                  dark:text-slate-400
                "
              >
                <Receipt
                  size={26}
                />
              </div>

              <p
                className="
                  mt-4

                  text-sm
                  font-bold

                  text-slate-700

                  dark:text-slate-300
                "
              >
                No transactions recorded yet.
              </p>

              <p
                className="
                  mt-1

                  text-xs
                  font-bold

                  text-slate-500

                  dark:text-slate-400
                "
              >
                Add your first transaction
                to start tracking your money.
              </p>

            </div>

          ) : (

            <div>

              {recentTransactions.map(
                (transaction, index) => {

                  const isIncome =
                    transaction.type ===
                    "income";

                  return (
                    <div
                      key={
                        transaction._id
                      }
                      className={`
                        flex
                        items-center
                        justify-between
                        gap-4

                        px-6
                        py-4

                        transition-colors
                        duration-200

                        hover:bg-slate-50/70

                        dark:hover:bg-white/[0.025]

                        ${
                          index !==
                          recentTransactions.length - 1
                            ? "border-b border-slate-100 dark:border-white/[0.06]"
                            : ""
                        }
                      `}
                    >

                      {/* LEFT */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className={`
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center

                            rounded-2xl

                            border

                            ${
                              isIncome
                                ? `
                                  border-emerald-200
                                  bg-emerald-50
                                  text-emerald-600

                                  dark:border-emerald-400/20
                                  dark:bg-emerald-500/10
                                  dark:text-emerald-300
                                `
                                : `
                                  border-red-200
                                  bg-red-50
                                  text-red-600

                                  dark:border-red-400/20
                                  dark:bg-red-500/10
                                  dark:text-red-300
                                `
                            }
                          `}
                        >

                          {isIncome ? (
                            <ArrowUpRight
                              size={19}
                            />
                          ) : (
                            <ArrowDownRight
                              size={19}
                            />
                          )}

                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >

                          <p
                            className="
                              truncate

                              text-sm
                              font-extrabold

                              text-slate-800

                              dark:text-slate-200
                            "
                          >
                            {transaction.category}
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate

                              text-xs
                              font-bold

                              text-slate-500

                              dark:text-slate-400
                            "
                          >
                            {transaction.description ||
                              "No description"}
                          </p>

                        </div>

                      </div>


                      {/* RIGHT */}

                      <div
                        className="
                          shrink-0
                          text-right
                        "
                      >

                        <p
                          className={`
                            text-sm
                            font-extrabold

                            ${
                              isIncome
                                ? "text-emerald-600 dark:text-emerald-300"
                                : "text-red-600 dark:text-red-300"
                            }
                          `}
                        >
                          {isIncome
                            ? "+"
                            : "-"}
                          ₹
                          {formatAmount(
                            transaction.amount
                          )}
                        </p>

                        <p
                          className="
                            mt-0.5

                            text-[11px]
                            font-bold

                            text-slate-500

                            dark:text-slate-400
                          "
                        >
                          {transaction.date
                            ? new Date(
                                transaction.date
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;