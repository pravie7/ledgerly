import { useState } from "react";
import { addTransaction } from "../services/api";

export default function Transactions({
  transactions = [],
  setTransactions,
  categories = [],
  accounts = [],
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    merchant: "",
    amount: "",
    type: "expense",
    category: categories[0] || "Other",
    account: accounts[0]?.name || "Cash",
    note: "",
    date: today,
  });

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const balance = income - expense;

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function save() {
    if (!form.merchant || !form.amount) {
      alert("Merchant and Amount are required");
      return;
    }

    const tx = {
      id: crypto.randomUUID(),
      ...form,
      amount: Number(form.amount),
    };

    try {
      await addTransaction(tx);
    } catch {}

    setTransactions([tx, ...transactions]);

    setForm({
      merchant: "",
      amount: "",
      type: "expense",
      category: categories[0] || "Other",
      account: accounts[0]?.name || "Cash",
      note: "",
      date: today,
    });
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Total Income</small>
          <h2 style={{ color: "#16A34A" }}>
            ₹{income.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Total Expense</small>
          <h2 style={{ color: "#DC2626" }}>
            ₹{expense.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Balance</small>
          <h2 style={{ color: "#2563EB" }}>
            ₹{balance.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Transactions</small>
          <h2>{transactions.length}</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Add Transaction</h2>

        <div className="grid2">
          <input
            placeholder="Merchant"
            value={form.merchant}
            onChange={(e) => update("merchant", e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
          />

          <select
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

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

          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />

          <div style={{ gridColumn: "1 / -1" }}>
            <textarea
              rows="3"
              placeholder="Note (optional)"
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
            />
          </div>
        </div>

        <button onClick={save} style={{ marginTop: 16 }}>
          Add Transaction
        </button>
      </div>

      <div className="panel">
        <h2>All Transactions</h2>

        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Account</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.merchant}</td>
                  <td>{tx.account}</td>
                  <td>{tx.category}</td>
                  <td
                    style={{
                      color:
                        tx.type === "income"
                          ? "#16A34A"
                          : "#DC2626",
                      fontWeight: 600,
                    }}
                  >
                    {tx.type === "income" ? "+" : "-"}₹
                    {Number(tx.amount).toLocaleString()}
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
