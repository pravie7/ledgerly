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

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function Transactions({
  transactions,
  setTransactions,
}) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Shopping");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      return (
        transaction.merchant?.toLowerCase().includes(query) ||
        transaction.category?.toLowerCase().includes(query) ||
        transaction.type?.toLowerCase().includes(query)
      );
    });
  }, [transactions, search]);

  function resetForm() {
    setMerchant("");
    setAmount("");
    setType("expense");
    setCategory("Shopping");
    setEditingId(null);
  }

  function saveTransaction() {
    const cleanMerchant = merchant.trim();
    const numericAmount = Number(amount);

    if (!cleanMerchant) {
      alert("Please enter a merchant name.");
      return;
    }

    if (!amount || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const duplicate = transactions.find((transaction) => {
      if (transaction.id === editingId) {
        return false;
      }

      return (
        transaction.merchant?.trim().toLowerCase() ===
          cleanMerchant.toLowerCase() &&
        Number(transaction.amount) === numericAmount &&
        transaction.type === type &&
        transaction.category === category
      );
    });

    if (duplicate) {
      alert("Duplicate transaction detected.");
      return;
    }

    if (editingId) {
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === editingId
            ? {
                ...transaction,
                merchant: cleanMerchant,
                amount: numericAmount,
                type,
                category,
              }
            : transaction
        )
      );
    } else {
      const newTransaction = {
        id: crypto.randomUUID(),
        merchant: cleanMerchant,
        amount: numericAmount,
        type,
        category,
        date: new Date().toISOString().slice(0, 10),
      };

      setTransactions([
        newTransaction,
        ...transactions,
      ]);
    }

    resetForm();
  }

  function editTransaction(transaction) {
    setEditingId(transaction.id);
    setMerchant(transaction.merchant || "");
    setAmount(String(transaction.amount || ""));
    setType(transaction.type || "expense");
    setCategory(transaction.category || "Other");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteTransaction(id) {
    const confirmed = window.confirm(
      "Delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    setTransactions(
      transactions.filter(
        (transaction) => transaction.id !== id
      )
    );

    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Transactions</h1>

          <p>
            Record and manage your income and expenses.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>
              {editingId
                ? "Edit Transaction"
                : "Add Transaction"}
            </h2>

            <p>
              {editingId
                ? "Update the selected transaction."
                : "Add your income or expenses to Ledgerly."}
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formField">
            <label>Merchant</label>

            <input
              type="text"
              placeholder="Amazon, Swiggy, Salary..."
              value={merchant}
              onChange={(event) =>
                setMerchant(event.target.value)
              }
            />
          </div>

          <div className="formField">
            <label>Amount</label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />
          </div>

          <div className="formField">
            <label>Type</label>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="formField">
            <label>Category</label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="formActions">
          <button onClick={saveTransaction}>
            {editingId
              ? "Save Changes"
              : "+ Add Transaction"}
          </button>

          {editingId && (
            <button
              className="secondaryButton"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Transaction History</h2>

            <p>
              {transactions.length} recorded{" "}
              {transactions.length === 1
                ? "transaction"
                : "transactions"}
              .
            </p>
          </div>

          <input
            className="searchInput"
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">↕</div>

            <h3>
              {transactions.length === 0
                ? "No transactions yet"
                : "No matching transactions"}
            </h3>

            <p>
              {transactions.length === 0
                ? "Add your first income or expense above."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Merchant</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map(
                  (transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.date}</td>

                      <td>
                        <strong>
                          {transaction.merchant}
                        </strong>
                      </td>

                      <td>
                        {transaction.category}
                      </td>

                      <td>
                        <span
                          className={
                            transaction.type ===
                            "income"
                              ? "transactionType income"
                              : "transactionType expense"
                          }
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td>
                        <strong
                          className={
                            transaction.type ===
                            "income"
                              ? "positive"
                              : "negative"
                          }
                        >
                          {transaction.type ===
                          "income"
                            ? "+"
                            : "-"}
                          {formatCurrency(
                            transaction.amount
                          )}
                        </strong>
                      </td>

                      <td>
                        <div className="tableActions">
                          <button
                            className="secondaryButton"
                            onClick={() =>
                              editTransaction(
                                transaction
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete"
                            onClick={() =>
                              deleteTransaction(
                                transaction.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
