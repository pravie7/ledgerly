const menus = [
  { name: "Dashboard", icon: "📊" },
  { name: "Transactions", icon: "💳" },
  { name: "Recurring", icon: "🔁" },
  { name: "Subscriptions", icon: "📅" },
  { name: "Budgets", icon: "🎯" },
  { name: "Goals", icon: "💰" },
  { name: "Documents", icon: "📄" },
  { name: "Rules", icon: "⚙️" },
  { name: "Settings", icon: "🛠️" },
];

export default function Sidebar({ page, setPage }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">₹</div>

          <div>
            <div className="brandName">Ledgerly</div>
            <div className="brandSubtitle">Personal Finance OS</div>
          </div>
        </div>

        <nav className="desktopNavigation">
          {menus.map((item) => (
            <button
              key={item.name}
              className={`navItem ${page === item.name ? "active" : ""}`}
              onClick={() => setPage(item.name)}
            >
              <span className="navIcon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebarFooter">
          <div>Ledgerly v3.2</div>
          <div>Offline Ready</div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobileNavigation">
        {menus.slice(0, 5).map((item) => (
          <button
            key={item.name}
            className={`mobileNavItem ${
              page === item.name ? "active" : ""
            }`}
            onClick={() => setPage(item.name)}
          >
            <span>{item.icon}</span>
            <small>{item.name}</small>
          </button>
        ))}
      </nav>
    </>
  );
}
