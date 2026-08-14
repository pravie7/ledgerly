export default function Header({ page }) {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const subtitle = {
    Dashboard: "Financial overview & analytics",
    Transactions: "Track income and expenses",
    Recurring: "Manage recurring payments",
    Subscriptions: "Monitor monthly subscriptions",
    Budgets: "Control monthly spending",
    Goals: "Savings & wealth planning",
    Documents: "Receipts and statements",
    Rules: "Automation & categorization",
    Settings: "Accounts and preferences",
  };

  return (
    <header className="topBar">
      <div>
        <div className="topBarTitle">{page}</div>
        <div className="topBarSubtitle">
          {subtitle[page] || "Ledgerly Personal Finance"}
        </div>
      </div>

      <div className="topBarStatus">
        <div className="statusDot"></div>
        <span>Offline Ready</span>
        <span>•</span>
        <strong>{today}</strong>
      </div>
    </header>
  );
}
