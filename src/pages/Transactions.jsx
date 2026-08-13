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

  function addTransaction() {
    const cleanMerchant = merchant.trim();
    const numericAmount = Number(amount);

    if (!cleanMerchant) {
      alert("Please enter a merchant.");
      return;
    }

    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const duplicate = transactions.some(
      (transaction) =>
        String(transaction.merchant || "").toLowerCase() ===
          cleanMerchant.toLowerCase() &&
        Number(transaction.amount) === numericAmount &&
        transaction.type === type &&
        transaction.category === category
    );

    if (duplicate) {
      alert("A similar transaction already exists.");
      return;
    }

    const newTransaction = {
      id:
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      merchant: cleanMerchant,
      amount: numericAmount,
      type,
      category,
      date: new Date().toISOString().slice(0, 10),
    };

    setTransactions((current) => [
      newTransaction,
      ...current,
    ]);

    setMerchant("");
    setAmount("");
    setType("expense");
    setCategory("Shopping");
  }

  function deleteTransaction(id) {
    const confirmed = window.confirm(
      "Delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );
  }

  const filteredTransactions = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const merchantName = String(
        transaction.merchant || ""
      ).toLowerCase();

      const transactionCategory = String(
        transaction.category || ""
      ).toLowerCase();

      const transactionType = String(
        transaction.type || ""
      ).toLowerCase();

      return (
        merchantName.includes(searchText) ||
        transactionCategory.includes(searchText) ||
        transactionType.includes(searchText)
      );
    });
  }, [transactions, search]);

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
            <h2>Add Transaction</h2>
            <p>
              Record an income or expense to keep your
              financial overview accurate.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formField">
            <label htmlFor="merchant">
              Merchant
            </label>

            <input
              id="merchant"
              type="text"
              placeholder="Amazon, Swiggy, Salary..."
              value={merchant}
              onChange={(event) =>
                setMerchant(event.target.value)
              }
            />
          </div>

          <div className="formField">
            <label htmlFor="amount">
              Amount
            </label>

            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />
          </div>

          <div className="formField">
            <label htmlFor="transactionType">
              Type
            </label>

            <select
              id="transactionType"
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option value="expense">
                Expense
              </option>

              <option value="income">
                Income
              </option>
            </select>
          </div>

          <div className="formField">
            <label htmlFor="transactionCategory">
              Category
            </label>

            <select
              id="transactionCategory"
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
          <button
            type="button"
            onClick={addTransaction}
          >
            + Add Transaction
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader transactionHistoryHeader">
          <div>
            <h2>Transaction History</h2>

            <p>
              {transactions.length}{" "}
              {transactions.length === 1
                ? "transaction"
                : "transactions"}{" "}
              recorded.
            </p>
          </div>

          <input
            className="searchInput"
            type="search"
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
                : "Try a different merchant, category, or type."}
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
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map(
                  (transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {transaction.date || "-"}
                      </td>

                      <td>
                        <strong>
                          {transaction.merchant || "Unknown"}
                        </strong>
                      </td>

                      <td>
                        {transaction.category || "Other"}
                      </td>

                      <td>
                        <span
                          className={
                            transaction.type === "income"
                              ? "transactionType incomeType"
                              : "transactionType expenseType"
                          }
                        >
                          {transaction.type === "income"
                            ? "Income"
                            : "Expense"}
                        </span>
                      </td>

                      <td
                        className={
                          transaction.type === "income"
                            ? "positive transactionAmount"
                            : "transactionAmount"
                        }
                      >
                        {transaction.type === "income"
                          ? "+"
                          : "-"}
                        {formatCurrency(
                          transaction.amount
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="delete"
                          onClick={() =>
                            deleteTransaction(
                              transaction.id
                            )
                          }
                        >
                          Delete
                        </button>
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
