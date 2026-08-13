import { useEffect, useMemo, useState } from "react";

const categories = [
  "Groceries",
  "Shopping",
  "Dining",
  "Transport",
  "Utilities",
  "Health",
  "Entertainment",
];

export default function Budgets({ transactions }) {
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("ledgerly_budgets");
    return saved ? JSON.parse(saved) : [];
  });

  const [category, setCategory] = useState("Groceries");
  const [limit, setLimit] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "ledgerly_budgets",
      JSON.stringify(budgets)
    );
  }, [budgets]);

  const spentMap = useMemo(() => {
    const map = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return map;
  }, [transactions]);

  function addBudget() {
    if (!limit) return;

    if (budgets.some((b) => b.category === category)) {
      alert("Budget already exists");
      return;
    }

    setBudgets([
      ...budgets,
      {
        id: crypto.randomUUID(),
        category,
        limit: Number(limit),
      },
    ]);

    setLimit("");
  }

  function removeBudget(id) {
    setBudgets(budgets.filter((b) => b.id !== id));
  }

  return (
    <>
      <div className="panel">
        <h2>Create Monthly Budget</h2>

        <div className="row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>

        <button onClick={addBudget}>
          Create Budget
        </button>
      </div>

      <div className="panel">
        <h2>Budget Overview</h2>

        {budgets.length === 0 ? (
          <p>No budgets created.</p>
        ) : (
          budgets.map((b) => {
            const spent = spentMap[b.category] || 0;

            const percent = Math.min(
              100,
              (spent / b.limit) * 100
            );

            const remaining = b.limit - spent;

            const exceeded = spent > b.limit;

            return (
              <div className="budgetCard" key={b.id}>
                <div className="budgetHeader">
                  <h3>{b.category}</h3>

                  <button
                    className="delete"
                    onClick={() => removeBudget(b.id)}
                  >
                    Delete
                  </button>
                </div>

                <div className="budgetRow">
                  <span>Spent</span>

                  <strong>
                    ₹{spent.toLocaleString()} / ₹
                    {b.limit.toLocaleString()}
                  </strong>
                </div>

                <div className="progress">
                  <div
                    style={{
                      width: `${percent}%`,
                      background: exceeded
                        ? "#DC2626"
                        : "#6558D3",
                    }}
                  />
                </div>

                <p
                  style={{
                    color: exceeded
                      ? "#DC2626"
                      : "#16A34A",
                    fontWeight: "bold",
                  }}
                >
                  {exceeded
                    ? `Exceeded by ₹${Math.abs(
                        remaining
                      ).toLocaleString()}`
                    : `Remaining ₹${remaining.toLocaleString()}`}
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
