const menus = [
  ["Dashboard", "📊"],
  ["Transactions", "💳"],
  ["Recurring", "🔁"],
  ["Subscriptions", "📅"],
  ["Budgets", "🎯"],
  ["Goals", "💰"],
  ["Investments", "📈"],
  ["Documents", "📄"],
  ["Rules", "⚙️"],
  ["Reports", "📑"],
  ["Settings", "🛠️"],
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>₹ Ledgerly</h2>
        <small>Personal Finance OS</small>
      </div>

      <nav>
        {menus.map(([name, icon]) => (
          <button
            key={name}
            className={page === name ? "active" : ""}
            onClick={() => setPage(name)}
          >
            <span>{icon}</span>
            {name}
          </button>
        ))}
      </nav>

      <div className="version">
        <small>Ledgerly v4.0</small>
        <p>Cloud Sync Enabled</p>
      </div>
    </aside>
  );
}
