import { useMemo, useState } from "react";

const plans = [
  "Netflix",
  "Amazon Prime",
  "Spotify",
  "YouTube Premium",
  "Apple Music",
  "ChatGPT Plus",
  "Google One",
  "Disney+",
  "Microsoft 365",
  "Other",
];

export default function Subscriptions({
  subscriptions,
  setSubscriptions,
  categories,
  accounts,
}) {
  const [name, setName] = useState("Netflix");
  const [amount, setAmount] = useState("");
  const [billing, setBilling] = useState("Monthly");
  const [renewalDay, setRenewalDay] = useState(1);
  const [account, setAccount] = useState(accounts[0]?.name || "Cash");

  const monthlyCost = useMemo(() => {
    return subscriptions.reduce((sum, s) => {
      return sum + (s.billing === "Monthly" ? s.amount : s.amount / 12);
    }, 0);
  }, [subscriptions]);

  const yearlyCost = Math.round(monthlyCost * 12);

  function addSubscription() {
    if (!amount) return;

    const exists = subscriptions.find(
      (s) => s.name === name && s.billing === billing
    );

    if (exists) {
      alert("Subscription already exists");
      return;
    }

    const item = {
      id: crypto.randomUUID(),
      name,
      amount: Number(amount),
      billing,
      renewalDay: Number(renewalDay),
      account,
      category: "Subscriptions",
      active: true,
    };

    setSubscriptions([item, ...subscriptions]);

    setAmount("");
    setRenewalDay(1);
  }

  function toggle(id) {
    setSubscriptions(
      subscriptions.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      )
    );
  }

  function remove(id) {
    if (!confirm("Delete subscription?")) return;
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Monthly Cost</small>
          <h2 style={{ color: "#DC2626" }}>
            ₹{monthlyCost.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Annual Projection</small>
          <h2 style={{ color: "#7C3AED" }}>
            ₹{yearlyCost.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Active Plans</small>
          <h2>{subscriptions.filter((s) => s.active).length}</h2>
        </div>

        <div className="card">
          <small>Services</small>
          <h2>{subscriptions.length}</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Add Subscription</h2>

        <div className="row">
          <select value={name} onChange={(e) => setName(e.target.value)}>
            {plans.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="row">
          <select
            value={billing}
            onChange={(e) => setBilling(e.target.value)}
          >
            <option>Monthly</option>
            <option>Yearly</option>
          </select>

          <input
            type="number"
            min="1"
            max="31"
            placeholder="Renewal Day"
            value={renewalDay}
            onChange={(e) => setRenewalDay(e.target.value)}
          />
        </div>

        <div className="row">
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          >
            {accounts.length === 0 ? (
              <option>Cash</option>
            ) : (
              accounts.map((a) => (
                <option key={a.name}>{a.name}</option>
              ))
            )}
          </select>

          <button onClick={addSubscription}>Add Subscription</button>
        </div>
      </div>

      <div className="panel">
        <h2>Subscription Manager</h2>

        {subscriptions.length === 0 ? (
          <p>No subscriptions added.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Billing</th>
                <th>Renewal</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.name}</strong>
                    <div className="txMeta">{s.account}</div>
                  </td>

                  <td>{s.billing}</td>

                  <td>
                    {s.billing === "Monthly"
                      ? `Day ${s.renewalDay}`
                      : `${s.renewalDay} Jan`}
                  </td>

                  <td className="expense">
                    ₹{s.amount.toLocaleString()}
                  </td>

                  <td>
                    <button
                      className={s.active ? "secondary" : "delete"}
                      onClick={() => toggle(s.id)}
                    >
                      {s.active ? "Active" : "Paused"}
                    </button>
                  </td>

                  <td>
                    <button
                      className="delete"
                      onClick={() => remove(s.id)}
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
    </div>
  );
}
