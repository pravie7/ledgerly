import { useMemo, useState } from "react";

const categories = [
  "Shopping",
  "Groceries",
  "Dining",
  "Transport",
  "Utilities",
  "Health",
  "Entertainment",
  "Salary",
  "Other",
];

export default function Transactions({ transactions, setTransactions }) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Shopping");
  const [search, setSearch] = useState("");

  function addTransaction() {
    if (!merchant.trim() || !amount) return;

    const duplicate = transactions.find(
      (t) =>
        t.merchant.toLowerCase() === merchant.toLowerCase() &&
        t.amount === Number(amount) &&
        t.type === type
    );

    if (duplicate) {
      alert("Duplicate transaction detected");
      return;
    }

    const newTx = {
      id: crypto.randomUUID(),
      merchant,
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString().slice(0, 10),
    };

    setTransactions([newTx, ...transactions]);

    setMerchant("");
    setAmount("");
    setCategory("Shopping");
    setType("expense");
  }

  function deleteTransaction(id) {
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  const filtered = useMemo(() => {
    return transactions.filter((t) =>
      t.merchant.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  return (
    <>
      <div className="panel">
        <h2>Add Transaction</h2>

        <input
          placeholder="Merchant (Amazon, Swiggy...)"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="row">
          <select value={type} onChange={(e) => setType(e.target.value)}>
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

        <button onClick={addTransaction}>+ Add Transaction</button>
      </div>

      <div className="panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h2>Transaction History</h2>

          <input
            style={{ width: 220 }}
            placeholder="Search merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p>No matching transactions.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.merchant}</td>
                  <td>{t.category}</td>
                  <td>{t.type}</td>

                  <td
                    style={{
                      color: t.type === "income" ? "#16A34A" : "#111827",
                      fontWeight: "bold",
                    }}
                  >
                    {t.type === "income" ? "+" : "-"}₹
                    {t.amount.toLocaleString()}
                  </td>

                  <td>
                    <button
                      className="delete"
                      onClick={() => deleteTransaction(t.id)}
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
    </>
  );
}
