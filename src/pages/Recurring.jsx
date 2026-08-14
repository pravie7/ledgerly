import { useMemo, useState } from "react";

export default function Recurring({
  recurring = [],
  setRecurring,
  categories = [],
  accounts = [],
}) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: categories[0] || "Utilities",
    account: accounts[0]?.name || "Cash",
    frequency: "Monthly",
    nextDate: new Date().toISOString().slice(0, 10),
  });

  const totalMonthly = useMemo(() => {
    return recurring.reduce((sum, item) => {
      const amount = Number(item.amount);

      switch (item.frequency) {
        case "Weekly":
          return sum + amount * 4;
        case "Yearly":
          return sum + amount / 12;
        default:
          return sum + amount;
      }
    }, 0);
  }, [recurring]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addRecurring() {
    if (!form.name || !form.amount) {
      alert("Name and amount are required.");
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      ...form,
      amount: Number(form.amount),
      active: true,
    };

    setRecurring([newItem, ...recurring]);

    setForm({
      name: "",
      amount: "",
      category: categories[0] || "Utilities",
      account: accounts[0]?.name || "Cash",
      frequency: "Monthly",
      nextDate: new Date().toISOString().slice(0, 10),
    });
  }

  function toggle(id) {
    setRecurring(
      recurring.map((item) =>
        item.id === id
          ? { ...item, active: !item.active }
          : item
      )
    );
  }

  function remove(id) {
    setRecurring(recurring.filter((item) => item.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Recurring Bills</small>
          <h2>{recurring.length}</h2>
        </div>

        <div className="card">
          <small>Monthly Commitment</small>
          <h2 style={{ color: "#DC2626" }}>
            ₹{Math.round(totalMonthly).toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="panel">
        <h2>Add Recurring Payment</h2>

        <div className="grid2">
          <input
            placeholder="Netflix / Rent / EMI"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
          />

          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={form.account}
            onChange={(e) => update("account", e.target.value)}
          >
            {accounts.length === 0 ? (
              <option>Cash</option>
            ) : (
              accounts.map((a) => (
                <option key={a.id}>{a.name}</option>
              ))
            )}
          </select>

          <select
            value={form.frequency}
            onChange={(e) =>
              update("frequency", e.target.value)
            }
          >
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>

          <input
            type="date"
            value={form.nextDate}
            onChange={(e) => update("nextDate", e.target.value)}
          />
        </div>

        <button
          onClick={addRecurring}
          style={{ marginTop: 16 }}
        >
          Add Recurring Bill
        </button>
      </div>

      <div className="panel">
        <h2>Upcoming Payments</h2>

        {recurring.length === 0 ? (
          <p>No recurring payments added.</p>
        ) : (
          recurring.map((item) => (
            <div
              key={item.id}
              className="budgetRow"
              style={{ marginBottom: 16 }}
            >
              <div>
                <strong>{item.name}</strong>

                <div className="txMeta">
                  {item.frequency} • {item.account} • Due{" "}
                  {item.nextDate}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <strong>
                  ₹{Number(item.amount).toLocaleString()}
                </strong>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "flex-end",
                    marginTop: 6,
                  }}
                >
                  <button
                    onClick={() => toggle(item.id)}
                    style={{
                      fontSize: 12,
                      padding: "4px 8px",
                    }}
                  >
                    {item.active ? "Pause" : "Resume"}
                  </button>

                  <button
                    className="delete"
                    onClick={() => remove(item.id)}
                    style={{
                      fontSize: 12,
                      padding: "4px 8px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
