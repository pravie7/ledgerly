import { useMemo } from "react";
import {
  Cloud,
  CalendarDays,
  LogOut,
} from "lucide-react";

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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const subtitle = {
    Dashboard: "Financial overview & analytics",
    Transactions: "Track income and expenses",
    Accounts: "Manage your bank accounts",
    Transfers: "Move money between accounts",
    Recurring: "Automate recurring payments",
    Subscriptions: "Monitor monthly subscriptions",
    Budgets: "Control monthly spending",
    Goals: "Track savings goals",
    Investments: "Assets & liabilities",
    Portfolio: "Mutual funds, stocks & FD",
    Retirement: "FIRE & retirement planning",
    Reports: "Financial insights & exports",
    Documents: "CSV import & statements",
    Rules: "Auto categorisation engine",
    Notifications: "Reminders & alerts",
    Settings: "Ledgerly preferences",
  };

  return (
    <header className="header">
      <div className="headerLeft">
        <div className="greeting">
          {greeting},{" "}
          <strong>{user?.name || "User"}</strong>
        </div>

        <h1>{page}</h1>

        <p>{subtitle[page]}</p>
      </div>

      <div className="headerRight">
        <div className="statusCard">
          <Cloud size={18} color="#16a34a" />

          <div>
            <strong>Cloud Sync</strong>
            <small>Connected</small>
          </div>
        </div>

        <div className="dateCard">
          <CalendarDays size={18} />

          <div>
            <strong>{today}</strong>
            <small>Ledgerly v8.1</small>
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
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
