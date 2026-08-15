import { useMemo, useState } from "react";
import {
  addTransaction,
  getTransactions,
} from "../services/api";

export default function Transactions({
  transactions,
  setTransactions,
  categories,
  accounts,
}) {
  const [form, setForm] = useState({
    merchant: "",
    amount: "",
    type: "expense",
    category: "Shopping",
    account: accounts?.[0]?.name || "Cash",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.merchant || !form.amount) return;

    setSaving(true);

    await addTransaction({
      ...form,
      amount: Number(form.amount),
      transfer: false,
    });

    const latest = await getTransactions();
    setTransactions(latest);

    setForm({
      merchant: "",
      amount: "",
      type: "expense",
      category: "Shopping",
      account: accounts?.[0]?.name || "Cash",
      note: "",
      date: new Date().toISOString().slice(0, 10),
    });

    setSaving(false);
  }

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0),
    [transactions]
  );

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Total Income</small>
          <h2>₹{totalIncome.toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Total Expense</small>
          <h2>₹{totalExpense.toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Transactions</small>
          <h2>{transactions.length}</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Add Transaction</h2>

        <div className="row">
          <input
            placeholder="Merchant"
            value={form.merchant}
            onChange={(e) =>
              setForm({
                ...form,
                merchant: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
          />
        </div>

        <div className="row">
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="row">
          <select
            value={form.account}
            onChange={(e) =>
              setForm({
                ...form,
                account: e.target.value,
              })
            }
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
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
          />
        </div>

        <textarea
          rows="3"
          placeholder="Note"
          value={form.note}
          onChange={(e) =>
            setForm({
              ...form,
              note: e.target.value,
            })
          }
        />

        <button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Add Transaction"}
        </button>
      </div>

      <div className="panel">
        <h2>Transaction History</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>Account</th>
              <th align="right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.merchant}</td>
                <td>{t.category}</td>
                <td>{t.account}</td>
                <td
                  style={{
                    color:
                      t.type === "income"
                        ? "#16a34a"
                        : "#dc2626",
                    textAlign: "right",
                    fontWeight: 600,
                  }}
                >
                  {t.type === "income" ? "+" : "-"}₹
                  {Number(t.amount).toLocaleString()}
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan="5">
                  <center>No transactions found</center>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
