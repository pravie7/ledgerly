import { useMemo, useState } from "react";

const categories = [
  "Streaming",
  "Software",
  "Cloud Storage",
  "Fitness",
  "Education",
  "News",
  "Gaming",
  "Other",
];

const billingCycles = [
  "Monthly",
  "Quarterly",
  "Yearly",
];

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getMonthlyCost(amount, cycle) {
  const value = Number(amount || 0);

  if (cycle === "Monthly") {
    return value;
  }

  if (cycle === "Quarterly") {
    return value / 3;
  }

  if (cycle === "Yearly") {
    return value / 12;
  }

  return value;
}

export default function Subscriptions({
  subscriptions,
  setSubscriptions,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Streaming");
  const [billingCycle, setBillingCycle] =
    useState("Monthly");
  const [renewalDate, setRenewalDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const items = Array.isArray(subscriptions)
    ? subscriptions
    : [];

  const filteredSubscriptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.billingCycle
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [items, search]);

  const monthlyTotal = useMemo(() => {
    return items.reduce((total, item) => {
      if (item.active === false) {
        return total;
      }

      return (
        total +
        getMonthlyCost(
          item.amount,
          item.billingCycle
        )
      );
    }, 0);
  }, [items]);

  const yearlyTotal = monthlyTotal * 12;

  function resetForm() {
    setName("");
    setAmount("");
    setCategory("Streaming");
    setBillingCycle("Monthly");
    setRenewalDate(
      new Date().toISOString().slice(0, 10)
    );
    setEditingId(null);
  }

  function saveSubscription() {
    const cleanName = name.trim();
    const numericAmount = Number(amount);

    if (!cleanName) {
      alert("Please enter a subscription name.");
      return;
    }

    if (!amount || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!renewalDate) {
      alert("Please select a renewal date.");
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
        item.billingCycle === billingCycle
      );
    });

    if (duplicate) {
      alert("This subscription already exists.");
      return;
    }

    if (editingId) {
      setSubscriptions(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: cleanName,
                amount: numericAmount,
                category,
                billingCycle,
                renewalDate,
              }
            : item
        )
      );
    } else {
      const newSubscription = {
        id: crypto.randomUUID(),
        name: cleanName,
        amount: numericAmount,
        category,
        billingCycle,
        renewalDate,
        active: true,
      };

      setSubscriptions([
        newSubscription,
        ...items,
      ]);
    }

    resetForm();
  }

  function editSubscription(item) {
    setEditingId(item.id);
    setName(item.name || "");
    setAmount(String(item.amount || ""));
    setCategory(item.category || "Other");
    setBillingCycle(
      item.billingCycle || "Monthly"
    );
    setRenewalDate(
      item.renewalDate ||
        new Date().toISOString().slice(0, 10)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteSubscription(id) {
    const confirmed = window.confirm(
      "Delete this subscription?"
    );

    if (!confirmed) {
      return;
    }

    setSubscriptions(
      items.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
  }

  function toggleSubscription(id) {
    setSubscriptions(
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

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Subscriptions</h1>

          <p>
            Track recurring subscriptions and understand
            your ongoing costs.
          </p>
        </div>
      </section>

      <section className="statGrid">
        <div className="statCard">
          <span className="statLabel">
            Active Subscriptions
          </span>

          <strong className="statValue">
            {
              items.filter(
                (item) => item.active !== false
              ).length
            }
          </strong>

          <span className="statHint">
            Currently active
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Monthly Cost
          </span>

          <strong className="statValue">
            {formatCurrency(monthlyTotal)}
          </strong>

          <span className="statHint">
            Estimated monthly commitment
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Yearly Cost
          </span>

          <strong className="statValue">
            {formatCurrency(yearlyTotal)}
          </strong>

          <span className="statHint">
            Estimated annual commitment
          </span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>
              {editingId
                ? "Edit Subscription"
                : "Add Subscription"}
            </h2>

            <p>
              Record Netflix, software, cloud storage,
              memberships, and other subscriptions.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formField">
            <label>Subscription Name</label>

            <input
              type="text"
              placeholder="Netflix, Spotify, AWS..."
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
            <label>Billing Cycle</label>

            <select
              value={billingCycle}
              onChange={(event) =>
                setBillingCycle(event.target.value)
              }
            >
              {billingCycles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="formField">
            <label>Next Renewal</label>

            <input
              type="date"
              value={renewalDate}
              onChange={(event) =>
                setRenewalDate(event.target.value)
              }
            />
          </div>
        </div>

        <div className="formActions">
          <button onClick={saveSubscription}>
            {editingId
              ? "Save Changes"
              : "+ Add Subscription"}
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
            <h2>Subscription List</h2>

            <p>
              {items.length} subscription
              {items.length === 1 ? "" : "s"} recorded.
            </p>
          </div>

          <input
            className="searchInput"
            type="text"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        {filteredSubscriptions.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">◉</div>

            <h3>
              {items.length === 0
                ? "No subscriptions yet"
                : "No matching subscriptions"}
            </h3>

            <p>
              {items.length === 0
                ? "Add your first subscription above."
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
                  <th>Billing</th>
                  <th>Renewal</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSubscriptions.map(
                  (item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>

                      <td>{item.category}</td>

                      <td>{item.billingCycle}</td>

                      <td>{item.renewalDate}</td>

                      <td>
                        <strong>
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
                            toggleSubscription(
                              item.id
                            )
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
                              editSubscription(item)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete"
                            onClick={() =>
                              deleteSubscription(
                                item.id
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
