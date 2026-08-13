import { useEffect, useMemo, useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Recurring from "./pages/Recurring";
import Subscriptions from "./pages/Subscriptions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
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

    if (!saved) {
      return initialState;
    }

    return {
      ...initialState,
      ...JSON.parse(saved),
    };
  } catch {
    return initialState;
  }
}

export default function App() {
  const [page, setPage] = useState("Dashboard");

  const [state, setState] = useState(loadState);

  const {
    transactions,
    budgets,
    goals,
    recurring,
    subscriptions,
    documents,
    rules,
    tags,
    categories,
    accounts,
    assets,
    liabilities,
    netWorthConfigured,
  } = state;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function updateState(updates) {
    setState((current) => ({
      ...current,
      ...updates,
    }));
  }

  const income = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((total, t) => total + Number(t.amount), 0);
  }, [transactions]);

  const spending = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((total, t) => total + Number(t.amount), 0);
  }, [transactions]);

  const savings = income - spending;

  const savingsRate =
    income > 0 ? Math.round((savings / income) * 100) : 0;

  const netWorth = assets - liabilities;

  function resetAllData() {
    const confirmation = window.prompt(
      'Type "DELETE ALL LEDGERLY DATA" to permanently reset Ledgerly.'
    );

    if (confirmation !== "DELETE ALL LEDGERLY DATA") {
      return;
    }

    setState({
      ...initialState,
      categories: [...initialState.categories],
    });

    setPage("Dashboard");
  }

  function renderPage() {
    switch (page) {
      case "Dashboard":
        return (
          <Dashboard
            transactions={transactions}
            income={income}
            spending={spending}
            savings={savings}
            savingsRate={savingsRate}
            netWorth={netWorth}
            netWorthConfigured={netWorthConfigured}
            budgets={budgets}
            goals={goals}
          />
        );

      case "Transactions":
        return (
          <Transactions
            transactions={transactions}
            setTransactions={(value) =>
              updateState({ transactions: value })
            }
            categories={categories}
            accounts={accounts}
            tags={tags}
          />
        );

      case "Recurring":
        return (
          <Recurring
            recurring={recurring}
            setRecurring={(value) =>
              updateState({ recurring: value })
            }
            categories={categories}
            accounts={accounts}
          />
        );

      case "Subscriptions":
        return (
          <Subscriptions
            subscriptions={subscriptions}
            setSubscriptions={(value) =>
              updateState({ subscriptions: value })
            }
            categories={categories}
            accounts={accounts}
          />
        );

      case "Budgets":
        return (
          <Budgets
            budgets={budgets}
            setBudgets={(value) =>
              updateState({ budgets: value })
            }
            transactions={transactions}
            categories={categories}
          />
        );

      case "Goals":
        return (
          <Goals
            goals={goals}
            setGoals={(value) =>
              updateState({ goals: value })
            }
          />
        );

      case "Documents":
        return (
          <Documents
            documents={documents}
            setDocuments={(value) =>
              updateState({ documents: value })
            }
          />
        );

      case "Rules":
        return (
          <Rules
            rules={rules}
            setRules={(value) =>
              updateState({ rules: value })
            }
            categories={categories}
          />
        );

      case "Settings":
        return (
          <Settings
            assets={assets}
            liabilities={liabilities}
            netWorthConfigured={netWorthConfigured}
            categories={categories}
            accounts={accounts}
            tags={tags}
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
