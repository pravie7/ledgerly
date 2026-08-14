import { useEffect, useMemo, useState } from "react";

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
  accounts: [],
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function updateState(updates) {
    setState((prev) => ({ ...prev, ...updates }));
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
    if (
      prompt(
        'Type "DELETE ALL LEDGERLY DATA"'
      ) !== "DELETE ALL LEDGERLY DATA"
    )
      return;

    setState(initialState);
    setPage("Dashboard");
  }

  switch (page) {
    case "Dashboard":
      return (
        <div className="appShell">
          <Sidebar page={page} setPage={setPage} />
          <div className="mainArea">
            <Header page={page} />
            <main className="pageContent">
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
            </main>
          </div>
        </div>
      );

    case "Transactions":
      return (
        <div className="appShell">
          <Sidebar page={page} setPage={setPage} />
          <div className="mainArea">
            <Header page={page} />
            <main className="pageContent">
              <Transactions
                transactions={state.transactions}
                setTransactions={(v) =>
                  updateState({ transactions: v })
                }
                categories={state.categories}
                accounts={state.accounts}
                tags={state.tags}
              />
            </main>
          </div>
        </div>
      );

    case "Recurring":
      return (
        <div className="appShell">
          <Sidebar page={page} setPage={setPage} />
          <div className="mainArea">
            <Header page={page} />
            <main className="pageContent">
              <Recurring
                recurring={state.recurring}
                setRecurring={(v) =>
                  updateState({ recurring: v })
                }
                categories={state.categories}
                accounts={state.accounts}
              />
            </main>
          </div>
        </div>
      );

    case "Subscriptions":
      return (
        <div className="appShell">
          <Sidebar page={page} setPage={setPage} />
          <div className="mainArea">
            <Header page={page} />
            <main className="pageContent">
              <Subscriptions
                subscriptions={state.subscriptions}
                setSubscriptions={(v) =>
                  updateState({ subscriptions: v })
                }
                categories={state.categories}
                accounts={state.accounts}
              />
            </main>
          </div>
        </div>
      );

    case "Budgets":
      return (
        <div className="appShell">
          <Sidebar page={page} setPage={setPage} />
          <div className="mainArea">
            <Header page={page} />
            <main className="pageContent">
              <Budgets
                budgets={state.budgets}
                setBudgets={(v) =>
                  updateState({ budgets: v })
                }
                transactions={state.transactions}
                categories={state.categories}
              />
            </main>
          </div>
        </div>
      );

    case "Goals":
      return (
        <div className="appShell">
          <Sidebar page={page} setPage={setPage} />
          <div className="mainArea">
            <Header page={page} />
            <main className="pageContent">
              <Goals
                goals={state.goals}
                setGoals={(v) =>
                  updateState({ goals: v })
                }
              />
            </main>
          </div>
        </div>
      );

    case "Investments":
      return (
        <div className="appShell">
          <Sidebar page={page} setPage={setPage} />
          <div className="mainArea">
            <Header page={page} />
            <main className="pageContent">
              <Investments
                investments={state.investments}
                setInvestments={(v) =>
                  updateState({ investments: v })
                }
              />
            </main>
          </div>
        </div>
      );

    case "Documents":
      return (
        <div className="appShell">
          <Sidebar page={page} setPage={setPage} />
          <div className="mainArea">
            <Header page={page} />
            <main className="pageContent">
              <Documents
                documents={state.documents}
                setDocuments={(v) =>
                  updateState({ documents: v })
                }
              />
            </main>
          </div>
        </div>
      );

    case "Rules":
      return (
        <div className="appShell">
          <Sidebar page={page} setPage={setPage} />
          <div className="mainArea">
            <Header page={page} />
            <main className="pageContent">
              <Rules
                rules={state.rules}
                setRules={(v) => updateState({ rules: v })}
                categories={state.categories}
              />
            </main>
          </div>
        </div>
      );

    case "Settings":
      return (
        <div className="appShell">
          <Sidebar page={page} setPage={setPage} />
          <div className="mainArea">
            <Header page={page} />
            <main className="pageContent">
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
            </main>
          </div>
        </div>
      );

    default:
      return null;
  }
}
