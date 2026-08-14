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
  assets: 0,
  liabilities: 0,
  netWorthConfigured: false,
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Load latest transactions from D1
  useEffect(() => {
    async function loadCloudTransactions() {
      try {
        const data = await getTransactions();
        setState((prev) => ({
          ...prev,
          transactions: data,
        }));
      } catch (err) {
        console.error("Cloud sync failed", err);
      }
    }

    loadCloudTransactions();
  }, []);

  function updateState(updates) {
    setState((current) => ({
      ...current,
      ...updates,
    }));
  }

  const income = useMemo(
    () =>
      state.transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0),
    [state.transactions]
  );

  const spending = useMemo(
    () =>
      state.transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0),
    [state.transactions]
  );

  const savings = income - spending;
  const savingsRate =
    income > 0 ? Math.round((savings / income) * 100) : 0;

  const netWorth = state.assets - state.liabilities;

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
            netWorthConfigured={state.netWorthConfigured}
            budgets={state.budgets}
            goals={state.goals}
          />
        );

      case "Transactions":
        return (
          <Transactions
            transactions={state.transactions}
            setTransactions={(value) =>
              updateState({ transactions: value })
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
            setRecurring={(value) =>
              updateState({ recurring: value })
            }
            categories={state.categories}
            accounts={state.accounts}
          />
        );

      case "Subscriptions":
        return (
          <Subscriptions
            subscriptions={state.subscriptions}
            setSubscriptions={(value) =>
              updateState({ subscriptions: value })
            }
            categories={state.categories}
            accounts={state.accounts}
          />
        );

      case "Budgets":
        return (
          <Budgets
            budgets={state.budgets}
            setBudgets={(value) =>
              updateState({ budgets: value })
            }
            transactions={state.transactions}
            categories={state.categories}
          />
        );

      case "Goals":
        return (
          <Goals
            goals={state.goals}
            setGoals={(value) =>
              updateState({ goals: value })
            }
          />
        );

      case "Investments":
        return <Investments />;

      case "Documents":
        return (
          <Documents
            documents={state.documents}
            setDocuments={(value) =>
              updateState({ documents: value })
            }
          />
        );

      case "Rules":
        return (
          <Rules
            rules={state.rules}
            setRules={(value) => updateState({ rules: value })}
            categories={state.categories}
          />
        );

      case "Settings":
        return (
          <Settings
            assets={state.assets}
            liabilities={state.liabilities}
            netWorthConfigured={state.netWorthConfigured}
            categories={state.categories}
            accounts={state.accounts}
            tags={state.tags}
            setSettings={updateState}
            resetAllData={() => {}}
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
        <main className="pageContent">{renderPage()}</main>
      </div>
    </div>
  );
}
