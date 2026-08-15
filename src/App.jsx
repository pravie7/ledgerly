import { useEffect, useMemo, useState } from "react";
import {
  getTransactions,
  getAccounts,
  getSession,
  logout as apiLogout,
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

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
}

export default function App() {
  const [session, setSession] = useState(getSession());
  const [page, setPage] = useState("Dashboard");
  const [state, setState] = useState(loadState);

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  useEffect(() => {
    if (!session) return;

    async function syncCloud() {
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
      } catch (err) {
        console.error("Cloud sync failed", err);
      }
    }

    syncCloud();
  }, [session]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, session]);

  const transactions = useMemo(
    () => state.transactions.filter((t) => !t.transfer),
    [state.transactions]
  );

  const income = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0),
    [transactions]
  );

  const spending = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0),
    [transactions]
  );

  const savings = income - spending;
  const savingsRate = income ? Math.round((savings / income) * 100) : 0;

  const assets = state.investments.assets.reduce(
    (s, a) => s + Number(a.value || 0),
    0
  );

  const liabilities = state.investments.liabilities.reduce(
    (s, l) => s + Number(l.value || 0),
    0
  );

  const netWorth = assets - liabilities;

  function logout() {
    apiLogout();
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  function resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }

  if (!session) {
    return <Login onLogin={setSession} />;
  }

  const pages = {
    Dashboard: (
      <Dashboard
        transactions={transactions}
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
        transactions={transactions}
        setTransactions={(v) => updateState({ transactions: v })}
        categories={state.categories}
        accounts={state.accounts}
        tags={state.tags}
      />
    ),

    Accounts: (
      <Accounts
        accounts={state.accounts}
        setAccounts={(v) => updateState({ accounts: v })}
        transactions={state.transactions}
      />
    ),

    Transfers: (
      <Transfers
        accounts={state.accounts}
        transactions={state.transactions}
        setTransactions={(v) => updateState({ transactions: v })}
      />
    ),

    Recurring: (
      <Recurring
        recurring={state.recurring}
        setRecurring={(v) => updateState({ recurring: v })}
        transactions={state.transactions}
        setTransactions={(v) => updateState({ transactions: v })}
        categories={state.categories}
        accounts={state.accounts}
      />
    ),

    Subscriptions: (
      <Subscriptions
        subscriptions={state.subscriptions}
        setSubscriptions={(v) => updateState({ subscriptions: v })}
        categories={state.categories}
        accounts={state.accounts}
      />
    ),

    Budgets: (
      <Budgets
        budgets={state.budgets}
        setBudgets={(v) => updateState({ budgets: v })}
        transactions={transactions}
        categories={state.categories}
      />
    ),

    Goals: (
      <Goals
        goals={state.goals}
        setGoals={(v) => updateState({ goals: v })}
      />
    ),

    Investments: (
      <Investments
        investments={state.investments}
        setInvestments={(v) => updateState({ investments: v })}
      />
    ),

    Portfolio: (
      <Portfolio
        portfolio={state.portfolio}
        setPortfolio={(v) => updateState({ portfolio: v })}
      />
    ),

    Retirement: <Retirement />,

    Reports: <Reports transactions={transactions} />,

    Documents: (
      <Documents
        documents={state.documents}
        setDocuments={(v) => updateState({ documents: v })}
      />
    ),

    Rules: (
      <Rules
        rules={state.rules}
        setRules={(v) => updateState({ rules: v })}
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
        <Header page={page} user={session} onLogout={logout} />

        <main className="pageContent">
          {pages[page] || pages.Dashboard}
        </main>
      </div>
    </div>
  );
}
