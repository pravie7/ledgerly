import { useMemo, useState } from "react";

const frequencies = ["Daily", "Weekly", "Monthly", "Yearly"];

export default function Recurring({
  recurring,
  setRecurring,
  categories,
  accounts,
}) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState(
    categories[0] || "Other"
  );
  const [account, setAccount] = useState(
    accounts[0]?.name || "Cash"
  );
  const [frequency, setFrequency] = useState("Monthly");
  const [day, setDay] = useState(1);

  const totalIncome = useMemo(
    () =>
      recurring
        .filter((r) => r.type === "income")
        .reduce((s, r) => s + Number(r.amount), 0),
    [recurring]
  );

  const totalExpense = useMemo(
    () =>
      recurring
        .filter((r) => r.type === "expense")
        .reduce((s, r) => s + Number(r.amount), 0),
    [recurring]
  );

  function addRecurring() {
    if (!merchant || !amount) return;

    const item = {
      id: crypto.randomUUID(),
      merchant,
      amount: Number(amount),
      type,
      category,
      account,
      frequency,
      day: Number(day),
      active: true,
    };

    setRecurring([item, ...recurring]);

    setMerchant("");
    setAmount("");
    setDay(1);
  }

  function toggle(id) {
    setRecurring(
      recurring.map((r) =>
        r.id === id ? { ...r, active: !r.active } : r
      )
    );
  }

  function remove(id) {
    if (!confirm("Delete recurring payment?")) return;
    setRecurring(recurring.filter((r) => r.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Recurring Income</small>
          <h2 style={{ color: "#16A34A" }}>
            ₹{totalIncome.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Recurring Expense</small>
          <h2 style={{ color: "#DC2626" }}>
            ₹{totalExpense.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Net Monthly</small>
          <h2 style={{ color: "#2563EB" }}>
            ₹{(totalIncome - totalExpense).toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Active Plans</small>
          <h2>{recurring.filter((r) => r.active).length}</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Add Recurring Payment</h2>

        <div className="row">
          <input
            placeholder="Merchant / Salary"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="row">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="row">
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          >
            {accounts.length === 0 ? (
              <option>Cash</option>
            ) : (
              accounts.map((a) => (
                <option key={a.name}>{a.name}</option>
              ))
            )}
          </select>

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            {frequencies.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            max="31"
            placeholder="Day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </div>

        <button onClick={addRecurring}>
          Add Recurring Item
        </button>
      </div>

      <div className="panel">
        <h2>Recurring Schedule</h2>

        {recurring.length === 0 ? (
          <p>No recurring payments configured.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Type</th>
                <th>Frequency</th>
                <th>Next</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {recurring.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.merchant}</strong>
                    <div className="txMeta">{r.category}</div>
                  </td>

                  <td>{r.type}</td>

                  <td>{r.frequency}</td>

                  <td>
                    {r.frequency === "Monthly"
                      ? `Day ${r.day}`
                      : r.frequency}
                  </td>

                  <td
                    className={
                      r.type === "income"
                        ? "income"
                        : "expense"
                    }
                  >
                    {r.type === "income" ? "+" : "-"}₹
                    {r.amount.toLocaleString()}
                  </td>

                  <td>
                    <button
                      className={
                        r.active ? "secondary" : "delete"
                      }
                      onClick={() => toggle(r.id)}
                    >
                      {r.active ? "Active" : "Paused"}
                    </button>
                  </td>

                  <td>
                    <button
                      className="delete"
                      onClick={() => remove(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
