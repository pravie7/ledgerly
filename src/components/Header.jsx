import { useMemo } from "react";

export default function Header({
  page,
  user,
  onLogout,
}) {
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
    Accounts: "Manage bank accounts",
    Transfers: "Move money between accounts",
    Recurring: "Automate recurring bills",
    Subscriptions: "Monthly subscription tracker",
    Budgets: "Control your spending",
    Goals: "Track financial goals",
    Investments: "Net worth & assets",
    Portfolio: "Stocks, SIPs & Fixed Deposits",
    Retirement: "FIRE & retirement planning",
    Reports: "Financial reports & exports",
    Documents: "Import bank statements",
    Rules: "Auto categorization engine",
    Notifications: "Alerts & reminders",
    Settings: "Ledgerly preferences",
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
        <div className="greeting">
          {greeting},{" "}
          <strong>{user?.name || "User"}</strong>
        </div>

        <h1>{page}</h1>

        <p>{pageInfo[page]}</p>
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
            <small>Ledgerly v8.0</small>
          </div>
        </div>

        <div className="userCard">
          <div className="avatar">
            {(user?.name || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="userInfo">
            <strong>{user?.name}</strong>
            <small>{user?.email}</small>
          </div>

          <button
            className="logoutBtn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
