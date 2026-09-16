import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import DashboardLayout from "./components/layout/DashboardLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import SavingsGoals from "./pages/SavingsGoals";
import Insights from "./pages/Insights";
import RecurringTransactions from "./pages/RecurringTransactions";
import Notifications from "./pages/Notifications";
import Gamification from "./pages/Gamification";
import MoneyOwed from "./pages/MoneyOwed";
import Settings from "./pages/Settings";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Main Application */}
        <Route element={<DashboardLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/budgets"
            element={<Budgets />}
          />

          <Route
            path="/savings-goals"
            element={<SavingsGoals />}
          />

          <Route
            path="/insights"
            element={<Insights />}
          />

          <Route
            path="/recurring-transactions"
            element={<RecurringTransactions />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
            path="/gamification"
            element={<Gamification />}
          />

          <Route
            path="/money-owed"
            element={<MoneyOwed />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;