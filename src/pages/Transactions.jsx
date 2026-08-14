import { useMemo, useState } from "react";

export default function Transactions({
  transactions,
  setTransactions,
  categories,
  accounts,
  tags,
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
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.merchant
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (t.note || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || t.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  function clearForm() {
    setMerchant("");
    setAmount("");
    setType("expense");
    setCategory(categories[0] || "Other");
    setAccount(accounts[0]?.name || "Cash");
    setNote("");
    setEditingId(null);
  }

  function saveTransaction() {
    if (!merchant.trim() || !amount) return;

    const duplicate = transactions.find(
      (t) =>
        t.id !== editingId &&
        t.merchant.toLowerCase() ===
          merchant.toLowerCase() &&
        Number(t.amount) === Number(amount) &&
        t.type === type &&
        t.date === new Date().toISOString().slice(0, 10)
    );

    if (duplicate) {
      alert("Duplicate transaction detected.");
      return;
    }

    const tx = {
      id: editingId || crypto.randomUUID(),
      merchant: merchant.trim(),
      amount: Number(amount),
      type,
      category,
      account,
      note,
      tags: [],
      date: new Date().toISOString().slice(0, 10),
    };

    if (editingId) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingId ? tx : t
        )
      );
    } else {
      setTransactions([tx, ...transactions]);
    }

    clearForm();
  }

  function editTransaction(tx) {
    setEditingId(tx.id);
    setMerchant(tx.merchant);
    setAmount(String(tx.amount));
    setType(tx.type);
    setCategory(tx.category);
    setAccount(tx.account || "Cash");
    setNote(tx.note || "");
  }

  function deleteTransaction(id) {
    if (!confirm("Delete this transaction?")) return;

    setTransactions(
      transactions.filter((t) => t.id !== id)
    );
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Income</small>
          <h2 style={{ color: "#16A34A" }}>
            ₹{income.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Expense</small>
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
          <h2>{filteredTransactions.length}</h2>
        </div>
      </div>

      <div className="panel">
        <h2>
          {editingId
            ? "Edit Transaction"
            : "Add Transaction"}
        </h2>

        <div className="row">
          <input
            placeholder="Merchant"
            value={merchant}
            onChange={(e) =>
              setMerchant(e.target.value)
            }
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
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="row">
          <select
            value={account}
            onChange={(e) =>
              setAccount(e.target.value)
            }
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
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="row">
          <button onClick={saveTransaction}>
            {editingId
              ? "Update Transaction"
              : "Add Transaction"}
          </button>

          {editingId && (
            <button
              className="secondary"
              onClick={clearForm}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="row">
          <input
            placeholder="Search merchant or note..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

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
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="6">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>

                  <td>
                    <strong>{tx.merchant}</strong>
                    {tx.note && (
                      <div className="txMeta">
                        {tx.note}
                      </div>
                    )}
                  </td>

                  <td>{tx.category}</td>

                  <td>{tx.account || "Cash"}</td>

                  <td
                    className={
                      tx.type === "income"
                        ? "income"
                        : "expense"
                    }
                  >
                    {tx.type === "income"
                      ? "+"
                      : "-"}
                    ₹
                    {Number(
                      tx.amount
                    ).toLocaleString()}
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      <button
                        className="secondary"
                        onClick={() =>
                          editTransaction(tx)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete"
                        onClick={() =>
                          deleteTransaction(tx.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
