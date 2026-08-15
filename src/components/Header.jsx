import { useMemo } from "react";

export default function Header({ page }) {
  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const pageInfo = {
    Dashboard: "Financial overview & analytics",
    Transactions: "Track income and expenses",
    Accounts: "Manage your bank accounts",
    Transfers: "Internal money transfers",
    Recurring: "Automate recurring payments",
    Subscriptions: "Monthly subscription tracker",
    Budgets: "Control monthly spending",
    Goals: "Achieve your financial goals",
    Investments: "Net worth & asset management",
    Portfolio: "Stocks, SIPs & Fixed Deposits",
    Retirement: "FIRE & retirement planning",
    Reports: "Financial reports & exports",
    Documents: "Import bank statements",
    Rules: "Auto categorization engine",
    Notifications: "Alerts & reminders",
    Settings: "Application preferences",
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  return (
    <header className="header">
      <div className="headerLeft">
        <div className="greeting">{greeting}</div>

        <h1>{page}</h1>

        <p>{pageInfo[page] || "Personal Finance OS"}</p>
      </div>

      <div className="headerRight">
        <div className="statusCard">
          <div className="statusDot" />
          <div>
            <strong>Cloud Sync</strong>
            <small>Connected</small>
          </div>
        </div>

        <div className="dateCard">
          <div className="calendar">📅</div>
          <div>
            <strong>{today}</strong>
            <small>Ledgerly v7.2</small>
          </div>
        </div>
      </div>
    </header>
  );
}
