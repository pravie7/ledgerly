import { useEffect, useMemo, useState } from "react";
import { getTransactions } from "./services/api";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import Transfers from "./pages/Transfers";
import Recurring from "./pages/Recurring";
import Subscriptions from "./pages/Subscriptions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Investments from "./pages/Investments";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import Rules from "./pages/Rules";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

const STORAGE_KEY = "ledgerly_state";

const initialState = {
  transactions: [],
  accounts: [],
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

  // Cloud sync
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

  // Local persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  // Ignore internal transfers for finance reports
  const financialTransactions = useMemo(
    () => state.transactions.filter((t) => !t.transfer),
    [state.transactions]
  );

  const income = useMemo(
    () =>
      financialTransactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0),
    [financialTransactions]
  );

  const spending = useMemo(
    () =>
      financialTransactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0),
    [financialTransactions]
  );

  const savings = income - spending;

  const savingsRate =
    income > 0 ? Math.round((savings / income) * 100) : 0;

  const totalAssets = state.investments.assets.reduce(
    (s, a) => s + Number(a.value || 0),
    0
  );

  const totalLiabilities =
    state.investments.liabilities.reduce(
      (s, l) => s + Number(l.value || 0),
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
            transactions={financialTransactions}
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
            transactions={financialTransactions}
            setTransactions={(value) => {
              const transfers = state.transactions.filter(
                (t) => t.transfer
              );

              updateState({
                transactions: [...value, ...transfers],
              });
            }}
            categories={state.categories}
            accounts={state.accounts}
            tags={state.tags}
          />
        );

      case "Accounts":
        return (
          <Accounts
            accounts={state.accounts}
            setAccounts={(value) =>
              updateState({ accounts: value })
            }
            transactions={state.transactions}
          />
        );

      case "Transfers":
        return (
          <Transfers
            accounts={state.accounts}
            transactions={state.transactions}
            setTransactions={(value) =>
              updateState({ transactions: value })
            }
          />
        );

      case "Recurring":
        return (
          <Recurring
            recurring={state.recurring}
            setRecurring={(value) =>
              updateState({ recurring: value })
            }
            transactions={state.transactions}
            setTransactions={(value) =>
              updateState({ transactions: value })
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
            transactions={financialTransactions}
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
        return (
          <Investments
            investments={state.investments}
            setInvestments={(value) =>
              updateState({ investments: value })
            }
          />
        );

      case "Reports":
        return (
          <Reports transactions={financialTransactions} />
        );

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
            setRules={(value) =>
              updateState({ rules: value })
            }
            categories={state.categories}
          />
        );

      case "Notifications":
        return (
          <Notifications
            transactions={state.transactions}
            budgets={state.budgets}
            recurring={state.recurring}
            accounts={state.accounts}
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
