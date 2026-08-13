const navigation = [
  {
    name: "Dashboard",
    icon: "⌂",
  },
  {
    name: "Transactions",
    icon: "↕",
  },
  {
    name: "Recurring",
    icon: "↻",
  },
  {
    name: "Subscriptions",
    icon: "◉",
  },
  {
    name: "Budgets",
    icon: "▣",
  },
  {
    name: "Goals",
    icon: "◎",
  },
  {
    name: "Documents",
    icon: "▤",
  },
  {
    name: "Rules",
    icon: "◇",
  },
  {
    name: "Settings",
    icon: "⚙",
  },
];

export default function Sidebar({ page, setPage }) {
  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">L</div>

          <div>
            <div className="brandName">Ledgerly</div>
            <div className="brandSubtitle">
              Personal Finance
            </div>
          </div>
        </div>

        <nav className="desktopNavigation">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={
                page === item.name
                  ? "navItem active"
                  : "navItem"
              }
              onClick={() => setPage(item.name)}
            >
              <span className="navIcon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebarFooter">
          <span>Private Personal Finance</span>
        </div>
      </aside>

      <nav className="mobileNavigation">
        {navigation.map((item) => (
          <button
            key={item.name}
            className={
              page === item.name
                ? "mobileNavItem active"
                : "mobileNavItem"
            }
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
