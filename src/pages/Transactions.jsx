import { useMemo, useState } from "react";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

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
  const [category, setCategory] = useState("Shopping");
  const [account, setAccount] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  function addTransaction(event) {
    event.preventDefault();

    const cleanMerchant = merchant.trim();
    const numericAmount = Number(amount);

    if (!cleanMerchant) {
      alert("Enter a merchant or source.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      alert("Enter a valid positive amount.");
      return;
    }

    if (!date) {
      alert("Select a date.");
      return;
    }

    const fingerprint =
      `${date}|${cleanMerchant.toLowerCase()}|` +
      `${numericAmount.toFixed(2)}|${account
        .trim()
        .toLowerCase()}`;

    const duplicate = transactions.some(
      (transaction) =>
        transaction.fingerprint === fingerprint
    );

    if (duplicate) {
      alert("Duplicate transaction detected.");
      return;
    }

    const newTransaction = {
      id: createId(),
      fingerprint,
      merchant: cleanMerchant,
      amount: numericAmount,
      type,
      category,
      account: account.trim(),
      date,
      tags: [],
    };

    setTransactions([
      newTransaction,
      ...transactions,
    ]);

    setMerchant("");
    setAmount("");
    setType("expense");
    setCategory("Shopping");
    setAccount("");
    setDate(new Date().toISOString().slice(0, 10));
  }

  function deleteTransaction(id) {
    const confirmed = window.confirm(
      "Delete this transaction?"
    );

    if (!confirmed) return;

    setTransactions(
      transactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  }

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        transaction.merchant
          .toLowerCase()
          .includes(query) ||
        transaction.category
          .toLowerCase()
          .includes(query) ||
        (transaction.account || "")
          .toLowerCase()
          .includes(query);

      const matchesType =
        filterType === "all" ||
        transaction.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, filterType]);

  return (
    <div className="pageStack">
      <form
        className="panel"
        onSubmit={addTransaction}
      >
        <div className="panelHeader">
          <div>
            <h2>Add Transaction</h2>
            <p>
              Record income or an expense manually.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <label>
            Merchant / Source
            <input
              placeholder="Amazon, Salary, Swiggy..."
              value={merchant}
              onChange={(event) =>
                setMerchant(event.target.value)
              }
            />
          </label>

          <label>
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            />
          </label>

          <label>
            Type
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Account
            <select
              value={account}
              onChange={(event) =>
                setAccount(event.target.value)
              }
            >
              <option value="">
                No account selected
              </option>

              {accounts.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <button className="primaryButton" type="submit">
          + Add Transaction
        </button>
      </form>

      <section className="panel">
        <div className="panelHeader transactionToolbar">
          <div>
            <h2>Transaction History</h2>
            <p>
              {filteredTransactions.length} transaction
              {filteredTransactions.length === 1
                ? ""
                : "s"} shown
            </p>
          </div>

          <div className="toolbarControls">
            <input
              placeholder="Search..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              value={filterType}
              onChange={(event) =>
                setFilterType(event.target.value)
              }
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">↕</div>
            <h3>No transactions found</h3>
            <p>
              {transactions.length === 0
                ? "Your transaction history is empty."
                : "Try changing your search or filter."}
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
                  <th>Account</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th></th>
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

                      <td>{transaction.category}</td>

                      <td>
                        {transaction.account || "—"}
                      </td>

                      <td>
                        <span
                          className={
                            transaction.type === "income"
                              ? "badge incomeBadge"
                              : "badge expenseBadge"
                          }
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td
                        className={
                          transaction.type === "income"
                            ? "amountCell positive"
                            : "amountCell"
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
                          className="dangerButton smallButton"
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
