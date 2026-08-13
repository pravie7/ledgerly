import { useEffect, useMemo, useState } from "react";

const categories = [
  "Bills",
  "Rent",
  "Subscriptions",
  "Groceries",
  "Transport",
  "Health",
  "Insurance",
  "Investment",
  "Salary",
  "Other",
];

const frequencies = [
  "Daily",
  "Weekly",
  "Monthly",
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

  if (frequency === "Daily") {
    next.setDate(next.getDate() + 1);
  }

  if (frequency === "Weekly") {
    next.setDate(next.getDate() + 7);
  }

  if (frequency === "Monthly") {
    next.setMonth(next.getMonth() + 1);
  }

  if (frequency === "Yearly") {
    next.setFullYear(next.getFullYear() + 1);
  }

  return next.toISOString().slice(0, 10);
}

export default function Recurring({
  recurringTransactions,
  setRecurringTransactions,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Bills");
  const [frequency, setFrequency] = useState("Monthly");
  const [nextDate, setNextDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const items = Array.isArray(recurringTransactions)
    ? recurringTransactions
    : [];

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.frequency?.toLowerCase().includes(query)
      );
    });
  }, [items, search]);

  function resetForm() {
    setName("");
    setAmount("");
    setType("expense");
    setCategory("Bills");
    setFrequency("Monthly");
    setNextDate(
      new Date().toISOString().slice(0, 10)
    );
    setEditingId(null);
  }

  function saveRecurring() {
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

    const duplicate = items.find((item) => {
      if (item.id === editingId) {
        return false;
      }

      return (
        item.name?.trim().toLowerCase() ===
          cleanName.toLowerCase() &&
        Number(item.amount) === numericAmount &&
        item.type === type &&
        item.frequency === frequency
      );
    });

    if (duplicate) {
      alert("This recurring transaction already exists.");
      return;
    }

    if (editingId) {
      setRecurringTransactions(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: cleanName,
                amount: numericAmount,
                type,
                category,
                frequency,
                nextDate,
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: crypto.randomUUID(),
        name: cleanName,
        amount: numericAmount,
        type,
        category,
        frequency,
        nextDate,
        active: true,
      };

      setRecurringTransactions([
        newItem,
        ...items,
      ]);
    }

    resetForm();
  }

  function editRecurring(item) {
    setEditingId(item.id);
    setName(item.name || "");
    setAmount(String(item.amount || ""));
    setType(item.type || "expense");
    setCategory(item.category || "Other");
    setFrequency(item.frequency || "Monthly");
    setNextDate(
      item.nextDate ||
        new Date().toISOString().slice(0, 10)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteRecurring(id) {
    const confirmed = window.confirm(
      "Delete this recurring transaction?"
    );

    if (!confirmed) {
      return;
    }

    setRecurringTransactions(
      items.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
  }

  function toggleActive(id) {
    setRecurringTransactions(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              active: item.active === false,
            }
          : item
      )
    );
  }

  function moveToNextDate(item) {
    const updatedDate = getNextDate(
      item.nextDate,
      item.frequency
    );

    if (!updatedDate) {
      return;
    }

    setRecurringTransactions(
      items.map((currentItem) =>
        currentItem.id === item.id
          ? {
              ...currentItem,
              nextDate: updatedDate,
            }
          : currentItem
      )
    );
  }

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Recurring</h1>

          <p>
            Manage recurring income, bills, and regular
            financial commitments.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>
              {editingId
                ? "Edit Recurring Transaction"
                : "Add Recurring Transaction"}
            </h2>

            <p>
              Track payments or income that repeat
              automatically.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formField">
            <label>Name</label>

            <input
              type="text"
              placeholder="Rent, Salary, SIP..."
              value={name}
              onChange={(event) =>
                setName(event.target.value)
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

          <div className="formField">
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

          <div className="formField">
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

        <div className="formActions">
          <button onClick={saveRecurring}>
            {editingId
              ? "Save Changes"
              : "+ Add Recurring"}
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
            <h2>Recurring Transactions</h2>

            <p>
              {items.length} recurring{" "}
              {items.length === 1
                ? "item"
                : "items"}{" "}
              configured.
            </p>
          </div>

          <input
            className="searchInput"
            type="text"
            placeholder="Search recurring..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        {filteredItems.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">↻</div>

            <h3>
              {items.length === 0
                ? "No recurring transactions"
                : "No matching recurring transactions"}
            </h3>

            <p>
              {items.length === 0
                ? "Add a recurring payment or income above."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Frequency</th>
                  <th>Next Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>

                    <td>{item.category}</td>

                    <td>{item.frequency}</td>

                    <td>{item.nextDate}</td>

                    <td>
                      <strong
                        className={
                          item.type === "income"
                            ? "positive"
                            : "negative"
                        }
                      >
                        {item.type === "income"
                          ? "+"
                          : "-"}
                        {formatCurrency(item.amount)}
                      </strong>
                    </td>

                    <td>
                      <button
                        className={
                          item.active === false
                            ? "secondaryButton"
                            : "statusButton"
                        }
                        onClick={() =>
                          toggleActive(item.id)
                        }
                      >
                        {item.active === false
                          ? "Paused"
                          : "Active"}
                      </button>
                    </td>

                    <td>
                      <div className="tableActions">
                        <button
                          className="secondaryButton"
                          onClick={() =>
                            editRecurring(item)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="secondaryButton"
                          onClick={() =>
                            moveToNextDate(item)
                          }
                        >
                          Next
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
