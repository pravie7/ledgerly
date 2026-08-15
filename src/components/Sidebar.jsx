import {
  LayoutDashboard,
  Receipt,
  Wallet,
  ArrowLeftRight,
  Repeat,
  CreditCard,
  Target,
  PiggyBank,
  TrendingUp,
  Landmark,
  BarChart3,
  FileText,
  Bot,
  Bell,
  Settings,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Transactions", icon: Receipt },
  { name: "Accounts", icon: Wallet },
  { name: "Transfers", icon: ArrowLeftRight },
  { name: "Recurring", icon: Repeat },
  { name: "Subscriptions", icon: CreditCard },
  { name: "Budgets", icon: Target },
  { name: "Goals", icon: PiggyBank },
  { name: "Investments", icon: TrendingUp },
  { name: "Portfolio", icon: Landmark },
  { name: "Retirement", icon: PiggyBank },
  { name: "Reports", icon: BarChart3 },
  { name: "Documents", icon: FileText },
  { name: "Rules", icon: Bot },
  { name: "Notifications", icon: Bell },
  { name: "Settings", icon: Settings },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>₹ Ledgerly</h2>
        <p>Personal Finance OS</p>
      </div>

      <nav className="menu">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`menuItem ${
                page === item.name ? "active" : ""
              }`}
              onClick={() => setPage(item.name)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebarFooter">
        <div className="version">Ledgerly v8.1</div>
        <small>Cloud Sync Enabled</small>
      </div>
    </aside>
  );
}
