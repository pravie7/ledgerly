const menuItems = [
  { name: "Dashboard", icon: "📊" },
  { name: "Transactions", icon: "💳" },
  { name: "Accounts", icon: "🏦" },
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
        <p>Personal Finance OS</p>
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`menuItem ${
              page === item.name ? "active" : ""
            }`}
            onClick={() => setPage(item.name)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebarFooter">
        <div className="version">Ledgerly v6.0</div>
        <small>Cloud Sync Enabled</small>
      </div>
    </aside>
  );
}
