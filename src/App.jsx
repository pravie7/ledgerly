import { useEffect, useMemo, useState } from "react";
import {
  getSession,
  logout as apiLogout,
  getTransactions,
  getAccounts,
} from "./services/api";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import Transfers from "./pages/Transfers";
import Recurring from "./pages/Recurring";
import Subscriptions from "./pages/Subscriptions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Investments from "./pages/Investments";
import Portfolio from "./pages/Portfolio";
import Retirement from "./pages/Retirement";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import Rules from "./pages/Rules";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

const STORAGE_KEY = "ledgerly_state";

const INITIAL_STATE = {
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
    "Insurance",
    "Health",
    "Entertainment",
    "Income",
    "Transfer",
    "Other",
  ],
  investments: {
    assets: [],
    liabilities: [],
  },
  portfolio: {
    holdings: [],
    fixedDeposits: [],
  },
};

function loadLocal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...INITIAL_STATE, ...JSON.parse(saved) }
      : INITIAL_STATE;
  } catch {
    return INITIAL_STATE;
  }
}

export default function App() {
  const [session, setSession] = useState(getSession());
  const [page, setPage] = useState("Dashboard");
  const [state, setState] = useState(loadLocal);

  const updateState = (obj) =>
    setState((prev) => ({ ...prev, ...obj }));

  async function refreshCloud() {
    if (!session) return;

    try {
      const [transactions, accounts] = await Promise.all([
        getTransactions(),
        getAccounts(),
      ]);

      setState((prev) => ({
        ...prev,
        transactions,
        accounts,
      }));
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    refreshCloud();
  }, [session]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );
    }
  }, [state, session]);

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

  const savingsRate = income
    ? Math.round((savings / income) * 100)
    : 0;

  const netWorth =
    state.investments.assets.reduce(
      (s, a) => s + Number(a.value || 0),
      0
    ) -
    state.investments.liabilities.reduce(
      (s, l) => s + Number(l.value || 0),
      0
    );

  function logout() {
    apiLogout();
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  function resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
  }

  if (!session) {
    return <Login onLogin={setSession} />;
  }

  const pages = {
    Dashboard: (
      <Dashboard
        transactions={state.transactions}
        income={income}
        spending={spending}
        savings={savings}
        savingsRate={savingsRate}
        netWorth={netWorth}
        budgets={state.budgets}
        goals={state.goals}
      />
    ),

    Transactions: (
      <Transactions
        transactions={state.transactions}
        setTransactions={(v) =>
          updateState({ transactions: v })
        }
        categories={state.categories}
        accounts={state.accounts}
        refreshCloud={refreshCloud}
      />
    ),

    Accounts: (
      <Accounts
        accounts={state.accounts}
        setAccounts={(v) =>
          updateState({ accounts: v })
        }
        transactions={state.transactions}
        refreshCloud={refreshCloud}
      />
    ),

    Transfers: (
      <Transfers
        accounts={state.accounts}
        transactions={state.transactions}
        setTransactions={(v) =>
          updateState({ transactions: v })
        }
      />
    ),

    Recurring: (
      <Recurring
        recurring={state.recurring}
        setRecurring={(v) =>
          updateState({ recurring: v })
        }
        transactions={state.transactions}
        setTransactions={(v) =>
          updateState({ transactions: v })
        }
        categories={state.categories}
        accounts={state.accounts}
      />
    ),

    Subscriptions: (
      <Subscriptions
        subscriptions={state.subscriptions}
        setSubscriptions={(v) =>
          updateState({ subscriptions: v })
        }
        categories={state.categories}
        accounts={state.accounts}
      />
    ),

    Budgets: (
      <Budgets
        budgets={state.budgets}
        setBudgets={(v) =>
          updateState({ budgets: v })
        }
        transactions={state.transactions}
        categories={state.categories}
      />
    ),

    Goals: (
      <Goals
        goals={state.goals}
        setGoals={(v) =>
          updateState({ goals: v })
        }
      />
    ),

    Investments: (
      <Investments
        investments={state.investments}
        setInvestments={(v) =>
          updateState({ investments: v })
        }
      />
    ),

    Portfolio: (
      <Portfolio
        portfolio={state.portfolio}
        setPortfolio={(v) =>
          updateState({ portfolio: v })
        }
      />
    ),

    Retirement: <Retirement />,

    Reports: (
      <Reports transactions={state.transactions} />
    ),

    Documents: (
      <Documents
        documents={state.documents}
        setDocuments={(v) =>
          updateState({ documents: v })
        }
        transactions={state.transactions}
        setTransactions={(v) =>
          updateState({ transactions: v })
        }
        refreshCloud={refreshCloud}
      />
    ),

    Rules: (
      <Rules
        rules={state.rules}
        setRules={(v) =>
          updateState({ rules: v })
        }
        categories={state.categories}
      />
    ),

    Notifications: (
      <Notifications
        transactions={state.transactions}
        budgets={state.budgets}
        recurring={state.recurring}
        accounts={state.accounts}
      />
    ),

    Settings: (
      <Settings
        categories={state.categories}
        accounts={state.accounts}
        tags={state.tags}
        setSettings={updateState}
        resetAllData={resetAllData}
      />
    ),
  };

  return (
    <div className="appShell">
      <Sidebar page={page} setPage={setPage} />

      <div className="mainArea">
        <Header
          page={page}
          user={session}
          onLogout={logout}
        />

        <main className="pageContent">
          {pages[page] || pages.Dashboard}
        </main>
      </div>
    </div>
  );
}
