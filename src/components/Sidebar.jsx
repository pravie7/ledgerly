const navigationItems = [
  {
    label: "Dashboard",
    icon: "⌂",
  },
  {
    label: "Transactions",
    icon: "↕",
  },
  {
    label: "Recurring",
    icon: "↻",
  },
  {
    label: "Subscriptions",
    icon: "◉",
  },
  {
    label: "Budgets",
    icon: "▣",
  },
  {
    label: "Goals",
    icon: "◎",
  },
  {
    label: "Documents",
    icon: "▤",
  },
  {
    label: "Rules",
    icon: "◇",
  },
  {
    label: "Settings",
    icon: "⚙",
  },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebarBrand">
        <div className="brandMark">L</div>

        <div>
          <strong className="brandName">
            Ledgerly
          </strong>

          <span className="brandSubtitle">
            Personal Finance
          </span>
        </div>
      </div>

      <nav className="sidebarNav">
        {navigationItems.map((item) => {
          const active = page === item.label;

          return (
            <button
              key={item.label}
              type="button"
              className={
                active
                  ? "navItem active"
                  : "navItem"
              }
              onClick={() => setPage(item.label)}
              aria-current={
                active ? "page" : undefined
              }
            >
              <span className="navIcon">
                {item.icon}
              </span>

              <span className="navLabel">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="sidebarFooter">
        <span className="sidebarFooterDot" />

        <span>
          Private Personal Finance
        </span>
      </div>
    </aside>
  );
}
