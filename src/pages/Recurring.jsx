import { useMemo, useState } from "react";

const categories = [
  "Bills",
  "Rent",
  "Utilities",
  "Subscriptions",
  "Insurance",
  "Salary",
  "Investment",
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

function getNextDate(date, frequency) {
  const next = new Date(date);

  if (Number.isNaN(next.getTime())) {
    return "";
  }

  if (frequency === "Weekly") {
    next.setDate(next.getDate() + 7);
  }

  if (frequency === "Monthly") {
    next.setMonth(next.getMonth() + 1);
  }

  if (frequency === "Quarterly") {
    next.setMonth(next.getMonth() + 3);
  }

  if (frequency === "Yearly") {
    next.setFullYear(next.getFullYear() + 1);
  }

  return next.toISOString().slice(0, 10);
}

export default function Recurring({
  recurring,
  setRecurring,
}) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Bills");
  const [frequency, setFrequency] = useState("Monthly");
  const [nextDate, setNextDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [search, setSearch] = useState("");

  function addRecurring() {
    const cleanMerchant = merchant.trim();
    const numericAmount = Number(amount);

    if (!cleanMerchant) {
      alert("Please enter a merchant.");
      return;
    }

    if (
      !amount ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!nextDate) {
      alert("Please select the next date.");
      return;
    }

    const duplicate = recurring.some(
      (item) =>
        String(item.merchant || "").toLowerCase() ===
          cleanMerchant.toLowerCase() &&
        Number(item.amount) === numericAmount &&
        item.type === type &&
        item.frequency === frequency
    );

    if (duplicate) {
      alert("A similar recurring transaction already exists.");
      return;
    }

    const newRecurring = {
      id:
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      merchant: cleanMerchant,
      amount: numericAmount,
      type,
      category,
      frequency,
      nextDate,
      active: true,
    };

    setRecurring((current) => [
      newRecurring,
      ...current,
    ]);

    setMerchant("");
    setAmount("");
    setType("expense");
    setCategory("Bills");
    setFrequency("Monthly");
    setNextDate(
      new Date().toISOString().slice(0, 10)
    );
  }

  function deleteRecurring(id) {
    const confirmed = window.confirm(
      "Delete this recurring transaction?"
    );

    if (!confirmed) {
      return;
    }

    setRecurring((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function toggleRecurring(id) {
    setRecurring((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              active: item.active === false,
            }
          : item
      )
    );
  }

  function advanceDate(id) {
    setRecurring((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const updatedDate = getNextDate(
          item.nextDate,
          item.frequency
        );

        return {
          ...item,
          nextDate: updatedDate,
        };
      })
    );
  }

  const filteredRecurring = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return recurring;
    }

    return recurring.filter((item) => {
      const merchantName = String(
        item.merchant || ""
      ).toLowerCase();

      const categoryName = String(
        item.category || ""
      ).toLowerCase();

      const frequencyName = String(
        item.frequency || ""
      ).toLowerCase();

      return (
        merchantName.includes(searchText) ||
        categoryName.includes(searchText) ||
        frequencyName.includes(searchText)
      );
    });
  }, [recurring, search]);

  const activeCount = recurring.filter(
    (item) => item.active !== false
  ).length;

  const monthlyExpenseEstimate = recurring
    .filter(
      (item) =>
        item.active !== false &&
        item.type === "expense"
    )
    .reduce((total, item) => {
      const amount = Number(item.amount || 0);

      if (item.frequency === "Weekly") {
        return total + amount * 4.33;
      }

      if (item.frequency === "Monthly") {
        return total + amount;
      }

      if (item.frequency === "Quarterly") {
        return total + amount / 3;
      }

      if (item.frequency === "Yearly") {
        return total + amount / 12;
      }

      return total;
    }, 0);

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Recurring</h1>

          <p>
            Track bills, salary, subscriptions, and other
            repeating financial activity.
          </p>
        </div>
      </section>

      <section className="statGrid">
        <div className="statCard">
          <span className="statLabel">
            Recurring Items
          </span>

          <strong className="statValue">
            {recurring.length}
          </strong>

          <span className="statHint">
            Total configured
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Active Items
          </span>

          <strong className="statValue">
            {activeCount}
          </strong>

          <span className="statHint">
            Currently active
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Monthly Expenses
          </span>

          <strong className="statValue">
            {formatCurrency(monthlyExpenseEstimate)}
          </strong>

          <span className="statHint">
            Estimated recurring expenses
          </span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Add Recurring Transaction</h2>

            <p>
              Create a repeating financial item for future
              tracking.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formField">
            <label htmlFor="recurringMerchant">
              Merchant
            </label>

            <input
              id="recurringMerchant"
              type="text"
              placeholder="Netflix, Rent, Salary..."
              value={merchant}
              onChange={(event) =>
                setMerchant(event.target.value)
              }
            />
          </div>

          <div className="formField">
            <label htmlFor="recurringAmount">
              Amount
            </label>

            <input
              id="recurringAmount"
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
            <label htmlFor="recurringType">
              Type
            </label>

            <select
              id="recurringType"
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
            <label htmlFor="recurringCategory">
              Category
            </label>

            <select
              id="recurringCategory"
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

          <div className="formField">
            <label htmlFor="recurringFrequency">
              Frequency
            </label>

            <select
              id="recurringFrequency"
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

          <div className="formField">
            <label htmlFor="recurringNextDate">
              Next Date
            </label>

            <input
              id="recurringNextDate"
              type="date"
              value={nextDate}
              onChange={(event) =>
                setNextDate(event.target.value)
              }
            />
          </div>
        </div>

        <div className="formActions">
          <button
            type="button"
            onClick={addRecurring}
          >
            + Add Recurring
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader transactionHistoryHeader">
          <div>
            <h2>Recurring Transactions</h2>

            <p>
              Manage your repeating financial commitments.
            </p>
          </div>

          <input
            className="searchInput"
            type="search"
            placeholder="Search recurring..."
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
                ? "No recurring transactions"
                : "No matching recurring transactions"}
            </h3>

            <p>
              {recurring.length === 0
                ? "Add your first recurring item above."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Merchant</th>
                  <th>Category</th>
                  <th>Frequency</th>
                  <th>Next Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecurring.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>
                        {item.merchant || "Unknown"}
                      </strong>
                    </td>

                    <td>
                      {item.category || "Other"}
                    </td>

                    <td>
                      {item.frequency || "Monthly"}
                    </td>

                    <td>
                      {item.nextDate || "-"}
                    </td>

                    <td
                      className={
                        item.type === "income"
                          ? "positive transactionAmount"
                          : "transactionAmount"
                      }
                    >
                      {item.type === "income"
                        ? "+"
                        : "-"}
                      {formatCurrency(item.amount)}
                    </td>

                    <td>
                      <span
                        className={
                          item.active === false
                            ? "transactionType expenseType"
                            : "transactionType incomeType"
                        }
                      >
                        {item.active === false
                          ? "Paused"
                          : "Active"}
                      </span>
                    </td>

                    <td>
                      <div className="actionGroup">
                        <button
                          type="button"
                          onClick={() =>
                            toggleRecurring(item.id)
                          }
                        >
                          {item.active === false
                            ? "Resume"
                            : "Pause"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            advanceDate(item.id)
                          }
                        >
                          Next
                        </button>

                        <button
                          type="button"
                          className="delete"
                          onClick={() =>
                            deleteRecurring(item.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
