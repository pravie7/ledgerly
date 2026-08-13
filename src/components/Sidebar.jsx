const menus = [
  "Dashboard",
  "Transactions",
  "Budgets",
  "Goals",
  "Settings",
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <h2>Ledgerly</h2>

      {menus.map((m) => (
        <button
          key={m}
          className={page === m ? "nav active" : "nav"}
          onClick={() => setPage(m)}
        >
          {m}
        </button>
      ))}
    </aside>
  );
}
