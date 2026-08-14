import { useEffect, useMemo, useState } from "react";
import { getTransactions } from "./services/api";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Recurring from "./pages/Recurring";
import Subscriptions from "./pages/Subscriptions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Investments from "./pages/Investments";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import Rules from "./pages/Rules";
import Settings from "./pages/Settings";

const STORAGE_KEY = "ledgerly_state";

const initialState = {
  transactions: [],
  budgets: [],
  goals: [],
  recurring: [],
  subscriptions: [],
  documents: [],
  rules: [],
  tags: [],
  categories: [
    "Housing",
    "Groceries",
    "Shopping",
    "Dining",
    "Transportation",
    "Utilities",
    "Subscriptions",
    "Insurance",
    "Health",
    "Entertainment",
    "Income",
    "Needs review",
    "Other",
  ],
  accounts: [],
  investments: {
    assets: [
      { name: "Bank Balance", value: 0 },
      { name: "EPF", value: 0 },
      { name: "PPF", value: 0 },
      { name: "Mutual Funds", value: 0 },
      { name: "Gold", value: 0 },
      { name: "Land", value: 0 },
      { name: "Car", value: 0 },
    ],
    liabilities: [
      { name: "Home Loan", value: 0 },
      { name: "Car Loan", value: 0 },
      { name: "Credit Card", value: 0 },
      { name: "Personal Loan", value: 0 },
    ],
  },
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...initialState, ...JSON.parse(saved) }
      : initialState;
  } catch {
    return initialState;
  }
}

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [state, setState] = useState(loadState);

  // Load latest transactions from D1
  useEffect(() => {
    async function loadCloud() {
      try {
        const data = await getTransactions();
        setState((prev) => ({
          ...prev,
          transactions: data,
        }));
      } catch (err) {
        console.log("Cloud sync unavailable");
      }
    }

    loadCloud();
  }, []);

  // Save local state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function updateState(updates) {
    setState((prev) => ({
      ...prev,
      ...updates,
    }));
  }

  const income = useMemo(() => {
    return state.transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);
  }, [state.transactions]);

  const spending = useMemo(() => {
    return state.transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);
  }, [state.transactions]);

  const savings = income - spending;

  const savingsRate =
    income > 0 ? Math.round((savings / income) * 100) : 0;

  const totalAssets = state.investments.assets.reduce(
    (s, a) => s + Number(a.value),
    0
  );

  const totalLiabilities =
    state.investments.liabilities.reduce(
      (s, l) => s + Number(l.value),
      0
    );

  const netWorth = totalAssets - totalLiabilities;

  function resetAllData() {
    const confirm = window.prompt(
      'Type "DELETE ALL LEDGERLY DATA"'
    );

    if (confirm !== "DELETE ALL LEDGERLY DATA") return;

    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
    setPage("Dashboard");
  }

  function renderPage() {
    switch (page) {
      case "Dashboard":
        return (
          <Dashboard
            transactions={state.transactions}
            income={income}
            spending={spending}
            savings={savings}
            savingsRate={savingsRate}
            netWorth={netWorth}
            netWorthConfigured={totalAssets > 0}
            budgets={state.budgets}
            goals={state.goals}
          />
        );

      case "Transactions":
        return (
          <Transactions
            transactions={state.transactions}
            setTransactions={(v) =>
              updateState({ transactions: v })
            }
            categories={state.categories}
            accounts={state.accounts}
            tags={state.tags}
          />
        );

      case "Recurring":
        return (
          <Recurring
            recurring={state.recurring}
            setRecurring={(v) =>
              updateState({ recurring: v })
            }
            categories={state.categories}
            accounts={state.accounts}
          />
        );

      case "Subscriptions":
        return (
          <Subscriptions
            subscriptions={state.subscriptions}
            setSubscriptions={(v) =>
              updateState({ subscriptions: v })
            }
            categories={state.categories}
            accounts={state.accounts}
          />
        );

      case "Budgets":
        return (
          <Budgets
            budgets={state.budgets}
            setBudgets={(v) =>
              updateState({ budgets: v })
            }
            transactions={state.transactions}
            categories={state.categories}
          />
        );

      case "Goals":
        return (
          <Goals
            goals={state.goals}
            setGoals={(v) => updateState({ goals: v })}
          />
        );

      case "Investments":
        return (
          <Investments
            investments={state.investments}
            setInvestments={(v) =>
              updateState({ investments: v })
            }
          />
        );

      case "Reports":
        return (
          <Reports
            transactions={state.transactions}
          />
        );

      case "Documents":
        return (
          <Documents
            documents={state.documents}
            setDocuments={(v) =>
              updateState({ documents: v })
            }
          />
        );

      case "Rules":
        return (
          <Rules
            rules={state.rules}
            setRules={(v) => updateState({ rules: v })}
            categories={state.categories}
          />
        );

      case "Settings":
        return (
          <Settings
            assets={totalAssets}
            liabilities={totalLiabilities}
            netWorthConfigured={totalAssets > 0}
            categories={state.categories}
            accounts={state.accounts}
            tags={state.tags}
            setSettings={updateState}
            resetAllData={resetAllData}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="appShell">
      <Sidebar page={page} setPage={setPage} />

      <div className="mainArea">
        <Header page={page} />

        <main className="pageContent">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
