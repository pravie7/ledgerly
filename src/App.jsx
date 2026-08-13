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

  const [transactions, setTransactions] = useState(() => {
    const data = localStorage.getItem("ledgerly_transactions");
    return data ? JSON.parse(data) : [];
  });

  const [assets, setAssets] = useState(() =>
    Number(localStorage.getItem("ledgerly_assets") || 0)
  );

  const [liabilities, setLiabilities] = useState(() =>
    Number(localStorage.getItem("ledgerly_liabilities") || 0)
  );

  useEffect(() => {
    localStorage.setItem(
      "ledgerly_transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("ledgerly_assets", assets);
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("ledgerly_liabilities", liabilities);
  }, [liabilities]);

  const income = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((a, b) => a + b.amount, 0),
    [transactions]
  );

  const spending = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + b.amount, 0),
    [transactions]
  );

  const savings =
    income === 0 ? 0 : Math.round(((income - spending) / income) * 100);

  const netWorth = assets - liabilities;

  return (
    <div className="layout">
      <Sidebar page={page} setPage={setPage} />

      <main className="content">
        <Header title={page} />

        {page === "Dashboard" && (
          <Dashboard
            income={income}
            spending={spending}
            savings={savings}
            netWorth={netWorth}
            transactions={transactions}
          />
        )}

        {page === "Transactions" && (
          <Transactions
            transactions={transactions}
            setTransactions={setTransactions}
          />
        )}

        {page === "Budgets" && <Budgets />}

        {page === "Goals" && <Goals />}

        {page === "Settings" && (
          <Settings
            assets={assets}
            liabilities={liabilities}
            setAssets={setAssets}
            setLiabilities={setLiabilities}
          />
        )}
      </main>
    </div>
  );
}
