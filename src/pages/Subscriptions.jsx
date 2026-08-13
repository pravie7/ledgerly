import { useMemo, useState } from "react";

const categories = [
  "Entertainment",
  "Software",
  "Cloud Storage",
  "Streaming",
  "Education",
  "Fitness",
  "News",
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

function getInitialSubscriptions() {
  try {
    const saved = localStorage.getItem(
      "ledgerly_subscriptions"
    );

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getMonthlyCost(subscription) {
  const amount = Number(subscription.amount || 0);

  if (subscription.billingCycle === "Monthly") {
    return amount;
  }

  if (subscription.billingCycle === "Quarterly") {
    return amount / 3;
  }

  if (subscription.billingCycle === "Yearly") {
    return amount / 12;
  }

  return 0;
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(
    getInitialSubscriptions
  );

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(
    "Entertainment"
  );
  const [billingCycle, setBillingCycle] =
    useState("Monthly");
  const [nextBillingDate, setNextBillingDate] =
    useState("");
  const [search, setSearch] = useState("");

  function saveSubscriptions(items) {
    setSubscriptions(items);

    localStorage.setItem(
      "ledgerly_subscriptions",
      JSON.stringify(items)
    );
  }

  function addSubscription() {
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

    if (!nextBillingDate) {
      alert("Please select the next billing date.");
      return;
    }

    const duplicate = subscriptions.some(
      (subscription) =>
        subscription.name.toLowerCase() ===
          cleanName.toLowerCase() &&
        Number(subscription.amount) === numericAmount
    );

    if (duplicate) {
      alert("This subscription already exists.");
      return;
    }

    const newSubscription = {
      id:
        typeof crypto !== "undefined" &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      name: cleanName,
      amount: numericAmount,
      category,
      billingCycle,
      nextBillingDate,
      active: true,
      createdAt: new Date().toISOString(),
    };

    saveSubscriptions([
      newSubscription,
      ...subscriptions,
    ]);

    setName("");
    setAmount("");
    setCategory("Entertainment");
    setBillingCycle("Monthly");
    setNextBillingDate("");
  }

  function toggleSubscription(id) {
    const updated = subscriptions.map(
      (subscription) =>
        subscription.id === id
          ? {
              ...subscription,
              active: !subscription.active,
            }
          : subscription
    );

    saveSubscriptions(updated);
  }

  function deleteSubscription(id) {
    const confirmed = window.confirm(
      "Delete this subscription?"
    );

    if (!confirmed) {
      return;
    }

    saveSubscriptions(
      subscriptions.filter(
        (subscription) => subscription.id !== id
      )
    );
  }

  const filteredSubscriptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return subscriptions;
    }

    return subscriptions.filter((subscription) => {
      return (
        subscription.name
          .toLowerCase()
          .includes(query) ||
        subscription.category
          .toLowerCase()
          .includes(query) ||
        subscription.billingCycle
          .toLowerCase()
          .includes(query)
      );
    });
  }, [subscriptions, search]);

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.active
  );

  const monthlyCost = activeSubscriptions.reduce(
    (total, subscription) =>
      total + getMonthlyCost(subscription),
    0
  );

  const yearlyCost = monthlyCost * 12;

  const activeCount = activeSubscriptions.length;

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Subscriptions</h1>

          <p>
            Track your recurring subscriptions and understand
            how much they cost over time.
          </p>
        </div>
      </section>

      <section className="statGrid">
        <div className="statCard">
          <span className="statLabel">
            Active Subscriptions
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
            Monthly Cost
          </span>

          <strong className="statValue negative">
            {formatCurrency(monthlyCost)}
          </strong>

          <span className="statHint">
            Estimated monthly cost
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Yearly Cost
          </span>

          <strong className="statValue negative">
            {formatCurrency(yearlyCost)}
          </strong>

          <span className="statHint">
            Estimated annual cost
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Average / Subscription
          </span>

          <strong className="statValue">
            {formatCurrency(
              activeCount === 0
                ? 0
                : monthlyCost / activeCount
            )}
          </strong>

          <span className="statHint">
            Monthly average
          </span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Add Subscription</h2>

            <p>
              Record a subscription you pay for regularly.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formGroup">
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

          <div className="formGroup">
            <label>Next Billing Date</label>

            <input
              type="date"
              value={nextBillingDate}
              onChange={(event) =>
                setNextBillingDate(event.target.value)
              }
            />
          </div>
        </div>

        <button onClick={addSubscription}>
          + Add Subscription
        </button>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Your Subscriptions</h2>

            <p>
              Manage your active and inactive subscriptions.
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
              {subscriptions.length === 0
                ? "No subscriptions yet"
                : "No matching subscriptions"}
            </h3>

            <p>
              {subscriptions.length === 0
                ? "Add your first subscription above."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="transactionList">
            {filteredSubscriptions.map(
              (subscription) => (
                <div
                  className="transactionListItem"
                  key={subscription.id}
                >
                  <div>
                    <strong>
                      {subscription.name}
                    </strong>

                    <span>
                      {subscription.category} ·{" "}
                      {subscription.billingCycle} · Next:{" "}
                      {subscription.nextBillingDate}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <strong className="negative">
                      -{formatCurrency(subscription.amount)}
                    </strong>

                    <button
                      className={
                        subscription.active
                          ? "secondaryButton"
                          : "primaryButton"
                      }
                      onClick={() =>
                        toggleSubscription(
                          subscription.id
                        )
                      }
                    >
                      {subscription.active
                        ? "Active"
                        : "Inactive"}
                    </button>

                    <button
                      className="delete"
                      onClick={() =>
                        deleteSubscription(
                          subscription.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}
