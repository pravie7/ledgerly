import { useEffect, useMemo, useState } from "react";
import "./index.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";

export default function App() {
  const [page, setPage] = useState("Dashboard");

  // =========================================================
  // TRANSACTIONS
  // =========================================================

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("ledgerly_transactions");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to load transactions:", error);
      return [];
    }
  });

  // =========================================================
  // ASSETS
  // =========================================================

  const [assets, setAssets] = useState(() => {
    try {
      return Number(
        localStorage.getItem("ledgerly_assets") || 0
      );
    } catch {
      return 0;
    }
  });

  // =========================================================
  // LIABILITIES
  // =========================================================

  const [liabilities, setLiabilities] = useState(() => {
    try {
      return Number(
        localStorage.getItem("ledgerly_liabilities") || 0
      );
    } catch {
      return 0;
    }
  });

  // =========================================================
  // PERSIST TRANSACTIONS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "ledgerly_transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  // =========================================================
  // PERSIST ASSETS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "ledgerly_assets",
      String(assets)
    );
  }, [assets]);

  // =========================================================
  // PERSIST LIABILITIES
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "ledgerly_liabilities",
      String(liabilities)
    );
  }, [liabilities]);

  // =========================================================
  // TOTAL INCOME
  // =========================================================

  const income = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  // =========================================================
  // TOTAL EXPENSES
  // =========================================================

  const spending = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  // =========================================================
  // CURRENT CASH FLOW
  // =========================================================

  const cashFlow = income - spending;

  // =========================================================
  // SAVINGS RATE
  // =========================================================

  const savings = useMemo(() => {
    if (income <= 0) {
      return 0;
    }

    return Math.round(
      ((income - spending) / income) * 100
    );
  }, [income, spending]);

  // =========================================================
  // NET WORTH
  // =========================================================

  const netWorth = assets - liabilities;

  // =========================================================
  // EXPENSES BY CATEGORY
  // =========================================================

  const expensesByCategory = useMemo(() => {
    const categoryTotals = {};

    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        const category =
          transaction.category || "Other";

        categoryTotals[category] =
          (categoryTotals[category] || 0) +
          Number(transaction.amount || 0);
      });

    return categoryTotals;
  }, [transactions]);

  // =========================================================
  // RESET ALL DATA
  // =========================================================

  function resetAllData() {
    const confirmed = window.confirm(
      "Are you sure you want to reset all Ledgerly data? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("ledgerly_transactions");
    localStorage.removeItem("ledgerly_assets");
    localStorage.removeItem("ledgerly_liabilities");
    localStorage.removeItem("ledgerly_budgets");
    localStorage.removeItem("ledgerly_goals");

    setTransactions([]);
    setAssets(0);
    setLiabilities(0);

    setPage("Dashboard");
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="layout">
      <Sidebar
        page={page}
        setPage={setPage}
      />

      <main className="content">
        <Header title={page} />

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        {page === "Dashboard" && (
          <Dashboard
            income={income}
            spending={spending}
            cashFlow={cashFlow}
            savings={savings}
            netWorth={netWorth}
            transactions={transactions}
            expensesByCategory={expensesByCategory}
          />
        )}

        {/* ===================================================
            TRANSACTIONS
        =================================================== */}

        {page === "Transactions" && (
          <Transactions
            transactions={transactions}
            setTransactions={setTransactions}
          />
        )}

        {/* ===================================================
            BUDGETS
        =================================================== */}

        {page === "Budgets" && (
          <Budgets
            transactions={transactions}
          />
        )}

        {/* ===================================================
            GOALS
        =================================================== */}

        {page === "Goals" && (
          <Goals
            transactions={transactions}
          />
        )}

        {/* ===================================================
            SETTINGS
        =================================================== */}

        {page === "Settings" && (
          <Settings
            assets={assets}
            liabilities={liabilities}
            setAssets={setAssets}
            setLiabilities={setLiabilities}
            resetAllData={resetAllData}
          />
        )}
      </main>
    </div>
  );
}
