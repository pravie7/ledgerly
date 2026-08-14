import { useEffect, useMemo, useState } from "react";
import { getTransactions, addTransaction } from "../services/api";

export default function Transactions({
  transactions,
  setTransactions,
  categories,
  accounts,
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState(
    categories[0] || "Other"
  );
  const [account, setAccount] = useState(
    accounts[0]?.name || "Cash"
  );
  const [note, setNote] = useState("");
  const [date, setDate] = useState(today);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTransactions();
        if (Array.isArray(data)) {
          setTransactions(data);
        }
      } catch (err) {
        console.log("API not available yet");
      }
    }

    load();
  }, []);

  const income = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);
  }, [transactions]);

  const expense = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);
  }, [transactions]);

  async function createTransaction() {
    if (!merchant || !amount) return;

    const tx = {
      id: crypto.randomUUID(),
      merchant,
      amount: Number(amount),
      type,
      category,
      account,
      note,
      date,
    };

    try {
      await addTransaction(tx);
      const latest = await getTransactions();
      setTransactions(latest);
    } catch {
      setTransactions([tx, ...transactions]);
    }

    setMerchant("");
    setAmount("");
    setNote("");
    setDate(today);
  }

  function deleteTransaction(id) {
    if (!confirm("Delete this transaction?")) return;

    setTransactions(transactions.filter((t) => t.id !== id));
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
            ₹{(income - expense).toLocaleString()}
          </h2>
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

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <textarea
          rows={2}
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button onClick={createTransaction}>
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
                    className={
                      t.type === "income"
                        ? "income"
                        : "expense"
                    }
                  >
                    {t.type === "income" ? "+" : "-"}₹
                    {Number(t.amount).toLocaleString()}
                  </td>

                  <td>
                    <button
                      className="delete"
                      onClick={() =>
                        deleteTransaction(t.id)
                      }
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
