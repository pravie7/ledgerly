import { useMemo } from "react";

export default function Notifications({
  transactions = [],
  budgets = [],
  recurring = [],
  accounts = [],
}) {
  const today = new Date().toISOString().slice(0, 10);

  const dueBills = recurring.filter(
    (r) => r.active && r.nextDate <= today
  );

  const accountBalances = useMemo(() => {
    const map = {};

    accounts.forEach((a) => {
      map[a.name] = Number(a.opening || 0);
    });

    transactions.forEach((t) => {
      if (!t.account) return;

      if (t.type === "income")
        map[t.account] =
          (map[t.account] || 0) + Number(t.amount);

      if (t.type === "expense")
        map[t.account] =
          (map[t.account] || 0) - Number(t.amount);
    });

    return map;
  }, [accounts, transactions]);

  const lowBalance = Object.entries(accountBalances).filter(
    ([, balance]) => balance < 1000
  );

  const budgetAlerts = budgets
    .map((b) => {
      const spent = transactions
        .filter((t) => t.category === b.category)
        .reduce((s, t) => s + Number(t.amount), 0);

      return {
        category: b.category,
        spent,
        limit: Number(b.limit || b.amount || 0),
      };
    })
    .filter((b) => b.limit > 0 && b.spent >= b.limit);

  const salaryReceived = transactions.some(
    (t) =>
      t.type === "income" &&
      t.category === "Income" &&
      new Date(t.date).getMonth() === new Date().getMonth()
  );

  const allNotifications = [
    ...dueBills.map((b) => ({
      type: "due",
      title: `${b.name} payment due`,
      subtitle: `₹${Number(b.amount).toLocaleString()} • ${b.nextDate}`,
      color: "#DC2626",
    })),
    ...lowBalance.map(([name, balance]) => ({
      type: "low",
      title: `Low balance in ${name}`,
      subtitle: `Available ₹${Number(balance).toLocaleString()}`,
      color: "#EA580C",
    })),
    ...budgetAlerts.map((b) => ({
      type: "budget",
      title: `${b.category} budget exceeded`,
      subtitle: `Spent ₹${b.spent.toLocaleString()} of ₹${b.limit.toLocaleString()}`,
      color: "#B91C1C",
    })),
  ];

  if (!salaryReceived) {
    allNotifications.push({
      type: "salary",
      title: "Salary not received this month",
      subtitle: "Check your Income transactions",
      color: "#2563EB",
    });
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Notifications</small>
          <h2>{allNotifications.length}</h2>
        </div>

        <div className="card">
          <small>Due Bills</small>
          <h2 style={{ color: "#DC2626" }}>
            {dueBills.length}
          </h2>
        </div>

        <div className="card">
          <small>Low Balance</small>
          <h2 style={{ color: "#EA580C" }}>
            {lowBalance.length}
          </h2>
        </div>

        <div className="card">
          <small>Budget Alerts</small>
          <h2>{budgetAlerts.length}</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Notification Center</h2>

        {allNotifications.length === 0 ? (
          <p>🎉 You're all caught up. No alerts.</p>
        ) : (
          allNotifications.map((n, i) => (
            <div
              key={i}
              className="budgetRow"
              style={{
                marginBottom: 16,
                borderLeft: `4px solid ${n.color}`,
                paddingLeft: 12,
              }}
            >
              <div>
                <strong>{n.title}</strong>
                <div className="txMeta">{n.subtitle}</div>
              </div>

              <span
                style={{
                  color: n.color,
                  fontWeight: 600,
                }}
              >
                {n.type.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Due Bills</h2>

          {dueBills.length === 0 ? (
            <p>No bills due.</p>
          ) : (
            dueBills.map((bill) => (
              <div
                key={bill.id}
                className="budgetRow"
                style={{ marginBottom: 12 }}
              >
                <div>
                  <strong>{bill.name}</strong>
                  <div className="txMeta">{bill.nextDate}</div>
                </div>

                <strong>
                  ₹{Number(bill.amount).toLocaleString()}
                </strong>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <h2>Low Balance Accounts</h2>

          {lowBalance.length === 0 ? (
            <p>All accounts are healthy.</p>
          ) : (
            lowBalance.map(([name, balance]) => (
              <div
                key={name}
                className="budgetRow"
                style={{ marginBottom: 12 }}
              >
                <span>{name}</span>
                <strong style={{ color: "#EA580C" }}>
                  ₹{Number(balance).toLocaleString()}
                </strong>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
