import { useMemo } from "react";

export default function Header({ page }) {
  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const pageInfo = {
    Dashboard: "Financial overview & analytics",
    Transactions: "Track income and expenses",
    Accounts: "Manage your bank accounts",
    Transfers: "Move money between accounts",
    Recurring: "Automate recurring bills",
    Subscriptions: "Monthly subscription tracker",
    Budgets: "Control your monthly spending",
    Goals: "Track financial goals",
    Investments: "Monitor net worth & assets",
    Reports: "Profit & loss reports",
    Documents: "Import bank statements",
    Rules: "Auto categorization rules",
    Notifications: "Alerts & reminders",
    Settings: "Ledgerly preferences",
  };

  return (
    <header className="header">
      <div>
        <h1>{page}</h1>
        <p>{pageInfo[page] || "Personal Finance OS"}</p>
      </div>

      <div className="headerRight">
        <div className="status">
          <span className="dot" />
          <span>Cloud Sync</span>
        </div>

        <div className="dateBox">
          <span className="calendar">📅</span>
          <span>{today}</span>
        </div>
      </div>
    </header>
  );
}
