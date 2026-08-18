import { useMemo, useState } from "react";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
} from "../services/api";

export default function Transactions({
  transactions,
  setTransactions,
  categories,
  accounts,
}) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    merchant: "",
    amount: "",
    type: "expense",
    category: "Shopping",
    account: accounts[0]?.name || "Cash",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const income = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0),
    [transactions]
  );

  const expense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0),
    [transactions]
  );

  async function refresh() {
    const latest = await getTransactions();
    setTransactions(latest);
  }

  async function save() {
    if (!form.merchant || !form.amount) {
      alert("Merchant and Amount are required");
      return;
    }

    setSaving(true);

    try {
      await addTransaction({
        ...form,
        amount: Number(form.amount),
        transfer: false,
      });

      await refresh();

      setForm({
        merchant: "",
        amount: "",
        type: "expense",
        category: "Shopping",
        account: accounts[0]?.name || "Cash",
        note: "",
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      alert(err.message);
    }

    setSaving(false);
  }

  async function remove(id) {
    if (!confirm("Delete this transaction?")) return;

    await deleteTransaction(id);
    await refresh();
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Income</small>
          <h2>₹{income.toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Expense</small>
          <h2>₹{expense.toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Balance</small>
          <h2>₹{(income - expense).toLocaleString()}</h2>
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
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
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
          rows={3}
          placeholder="Notes"
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

        {transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Account</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>
                    <strong>{t.merchant}</strong>
                    {t.note && (
                      <div className="txMeta">{t.note}</div>
                    )}
                  </td>
                  <td>{t.category}</td>
                  <td>{t.account}</td>
                  <td
                    style={{
                      color:
                        t.type === "income"
                          ? "#16a34a"
                          : "#dc2626",
                      fontWeight: 700,
                    }}
                  >
                    {t.type === "income" ? "+" : "-"}₹
                    {Number(t.amount).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => remove(t.id)}
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
