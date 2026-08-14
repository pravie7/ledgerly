const menu = [
  { name: "Dashboard", icon: "📊" },
  { name: "Transactions", icon: "💳" },
  { name: "Accounts", icon: "🏦" },
  { name: "Transfers", icon: "🔄" },
  { name: "Recurring", icon: "🔁" },
  { name: "Subscriptions", icon: "📅" },
  { name: "Budgets", icon: "🎯" },
  { name: "Goals", icon: "💰" },
  { name: "Investments", icon: "📈" },
  { name: "Reports", icon: "📑" },
  { name: "Documents", icon: "📄" },
  { name: "Rules", icon: "⚙️" },
  { name: "Settings", icon: "🛠️" },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>₹ Ledgerly</h2>
        <small>Personal Finance OS</small>
      </div>

      <nav className="menu">
        {menu.map((item) => (
          <button
            key={item.name}
            className={`menuItem ${
              page === item.name ? "active" : ""
            }`}
            onClick={() => setPage(item.name)}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebarFooter">
        <strong>Ledgerly v6.3</strong>
        <small>Cloud Sync Enabled</small>
      </div>
    </aside>
  );
}
