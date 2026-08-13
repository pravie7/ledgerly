import { useMemo, useState } from "react";

const categories = [
  "Housing",
  "Utilities",
  "Groceries",
  "Dining",
  "Transport",
  "Health",
  "Insurance",
  "Entertainment",
  "Subscriptions",
  "Salary",
  "Other",
];

const frequencies = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
];

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getInitialRecurring() {
  try {
    const saved = localStorage.getItem("ledgerly_recurring");

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Recurring() {
  const [recurring, setRecurring] = useState(getInitialRecurring);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Utilities");
  const [frequency, setFrequency] = useState("Monthly");
  const [nextDate, setNextDate] = useState("");
  const [search, setSearch] = useState("");

  function saveRecurring(items) {
    setRecurring(items);

    localStorage.setItem(
      "ledgerly_recurring",
      JSON.stringify(items)
    );
  }

  function addRecurring() {
    const cleanName = name.trim();
    const numericAmount = Number(amount);

    if (!cleanName) {
      alert("Please enter a name.");
      return;
    }

    if (!amount || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!nextDate) {
      alert("Please select the next date.");
      return;
    }

    const duplicate = recurring.some(
      (item) =>
        item.name.toLowerCase() === cleanName.toLowerCase() &&
        Number(item.amount) === numericAmount &&
        item.type === type
    );

    if (duplicate) {
      alert("A similar recurring transaction already exists.");
      return;
    }

    const newItem = {
      id:
        typeof crypto !== "undefined" &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      name: cleanName,
      amount: numericAmount,
      type,
      category,
      frequency,
      nextDate,
      active: true,
      createdAt: new Date().toISOString(),
    };

    saveRecurring([newItem, ...recurring]);

    setName("");
    setAmount("");
    setType("expense");
    setCategory("Utilities");
    setFrequency("Monthly");
    setNextDate("");
  }

  function toggleActive(id) {
    const updated = recurring.map((item) =>
      item.id === id
        ? {
            ...item,
            active: !item.active,
          }
        : item
    );

    saveRecurring(updated);
  }

  function deleteRecurring(id) {
    const confirmed = window.confirm(
      "Delete this recurring transaction?"
    );

    if (!confirmed) {
      return;
    }

    saveRecurring(
      recurring.filter((item) => item.id !== id)
    );
  }

  const filteredRecurring = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return recurring;
    }

    return recurring.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.frequency.toLowerCase().includes(query)
      );
    });
  }, [recurring, search]);

  const activeCount = recurring.filter(
    (item) => item.active
  ).length;

  const monthlyExpense = recurring
    .filter(
      (item) =>
        item.active &&
        item.type === "expense" &&
        item.frequency === "Monthly"
    )
    .reduce((total, item) => total + Number(item.amount), 0);

  const monthlyIncome = recurring
    .filter(
      (item) =>
        item.active &&
        item.type === "income" &&
        item.frequency === "Monthly"
    )
    .reduce((total, item) => total + Number(item.amount), 0);

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Recurring</h1>

          <p>
            Track bills, subscriptions, salary, rent, and other
            repeating financial activity.
          </p>
        </div>
      </section>

      <section className="statGrid">
        <div className="statCard">
          <span className="statLabel">
            Active Recurring
          </span>

          <strong className="statValue">
            {activeCount}
          </strong>

          <span className="statHint">
            Currently active items
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Monthly Expenses
          </span>

          <strong className="statValue negative">
            {formatCurrency(monthlyExpense)}
          </strong>

          <span className="statHint">
            From monthly recurring expenses
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Monthly Income
          </span>

          <strong className="statValue positive">
            {formatCurrency(monthlyIncome)}
          </strong>

          <span className="statHint">
            From monthly recurring income
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Monthly Net
          </span>

          <strong
            className={
              monthlyIncome - monthlyExpense >= 0
                ? "statValue positive"
                : "statValue negative"
            }
          >
            {formatCurrency(
              monthlyIncome - monthlyExpense
            )}
          </strong>

          <span className="statHint">
            Income minus recurring expenses
          </span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Add Recurring Transaction</h2>

            <p>
              Create a repeating income or expense.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formGroup">
            <label>Name</label>

            <input
              type="text"
              placeholder="Rent, Netflix, Salary..."
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div className="formGroup">
            <label>Amount</label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />
          </div>

          <div className="formGroup">
            <label>Type</label>

            <select
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

          <div className="formGroup">
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

          <div className="formGroup">
            <label>Frequency</label>

            <select
              value={frequency}
              onChange={(event) =>
                setFrequency(event.target.value)
              }
            >
              {frequencies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label>Next Date</label>

            <input
              type="date"
              value={nextDate}
              onChange={(event) =>
                setNextDate(event.target.value)
              }
            />
          </div>
        </div>

        <button onClick={addRecurring}>
          + Add Recurring
        </button>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Recurring Transactions</h2>

            <p>
              Your saved recurring financial activity.
            </p>
          </div>

          <input
            className="searchInput"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        {filteredRecurring.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">↻</div>

            <h3>
              {recurring.length === 0
                ? "No recurring transactions yet"
                : "No matching transactions"}
            </h3>

            <p>
              {recurring.length === 0
                ? "Add your first recurring income or expense above."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="transactionList">
            {filteredRecurring.map((item) => (
              <div
                className="transactionListItem"
                key={item.id}
              >
                <div>
                  <strong>{item.name}</strong>

                  <span>
                    {item.category} · {item.frequency} ·
                    Next: {item.nextDate}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <strong
                    className={
                      item.type === "income"
                        ? "positive"
                        : ""
                    }
                  >
                    {item.type === "income"
                      ? "+"
                      : "-"}
                    {formatCurrency(item.amount)}
                  </strong>

                  <button
                    className={
                      item.active
                        ? "secondaryButton"
                        : "primaryButton"
                    }
                    onClick={() =>
                      toggleActive(item.id)
                    }
                  >
                    {item.active
                      ? "Active"
                      : "Inactive"}
                  </button>

                  <button
                    className="delete"
                    onClick={() =>
                      deleteRecurring(item.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
