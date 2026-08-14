import { useMemo, useState } from "react";

export default function Recurring({
  recurring = [],
  setRecurring,
  transactions = [],
  setTransactions,
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "Utilities",
    account: "Cash",
    frequency: "Monthly",
    nextDate: today,
  });

  const monthlyCommitment = useMemo(() => {
    return recurring
      .filter((r) => r.active)
      .reduce((sum, r) => sum + Number(r.amount), 0);
  }, [recurring]);

  const update = (k, v) =>
    setForm((p) => ({ ...p, [k]: v }));

  function addRecurring() {
    if (!form.name || !form.amount) return;

    setRecurring([
      {
        id: crypto.randomUUID(),
        ...form,
        amount: Number(form.amount),
        active: true,
      },
      ...recurring,
    ]);

    setForm({
      name: "",
      amount: "",
      category: "Utilities",
      account: "Cash",
      frequency: "Monthly",
      nextDate: today,
    });
  }

  function markPaid(item) {
    const alreadyPaid = transactions.some(
      (t) =>
        t.recurringId === item.id &&
        t.date === item.nextDate
    );

    if (alreadyPaid) {
      alert("Already paid.");
      return;
    }

    const tx = {
      id: crypto.randomUUID(),
      recurringId: item.id,
      merchant: item.name,
      amount: Number(item.amount),
      type: "expense",
      category: item.category,
      account: item.account,
      note: "Recurring Payment",
      date: item.nextDate,
    };

    setTransactions([tx, ...transactions]);

    const next = new Date(item.nextDate);

    if (item.frequency === "Weekly")
      next.setDate(next.getDate() + 7);

    if (item.frequency === "Monthly")
      next.setMonth(next.getMonth() + 1);

    if (item.frequency === "Yearly")
      next.setFullYear(next.getFullYear() + 1);

    setRecurring(
      recurring.map((r) =>
        r.id === item.id
          ? {
              ...r,
              nextDate: next
                .toISOString()
                .slice(0, 10),
            }
          : r
      )
    );
  }

  const dueBills = recurring.filter(
    (r) => r.active && r.nextDate <= today
  );

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Active Bills</small>
          <h2>{recurring.filter((r) => r.active).length}</h2>
        </div>

        <div className="card">
          <small>Due Today</small>
          <h2 style={{ color: "#DC2626" }}>
            {dueBills.length}
          </h2>
        </div>

        <div className="card">
          <small>Monthly Commitment</small>
          <h2>
            ₹{monthlyCommitment.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="panel">
        <h2>Add Recurring Bill</h2>

        <div className="grid2">
          <input
            placeholder="Netflix / Rent / EMI"
            value={form.name}
            onChange={(e) =>
              update("name", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              update("amount", e.target.value)
            }
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              update("category", e.target.value)
            }
          />

          <input
            placeholder="Account"
            value={form.account}
            onChange={(e) =>
              update("account", e.target.value)
            }
          />

          <select
            value={form.frequency}
            onChange={(e) =>
              update("frequency", e.target.value)
            }
          >
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>

          <input
            type="date"
            value={form.nextDate}
            onChange={(e) =>
              update("nextDate", e.target.value)
            }
          />
        </div>

        <button
          onClick={addRecurring}
          style={{ marginTop: 16 }}
        >
          Add Bill
        </button>
      </div>

      <div className="panel">
        <h2>Due Payments</h2>

        {dueBills.length === 0 ? (
          <p>No bills due today.</p>
        ) : (
          dueBills.map((bill) => (
            <div
              key={bill.id}
              className="budgetRow"
              style={{ marginBottom: 14 }}
            >
              <div>
                <strong>{bill.name}</strong>

                <div className="txMeta">
                  {bill.account} • {bill.nextDate}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <strong>
                  ₹{Number(bill.amount).toLocaleString()}
                </strong>

                <div style={{ marginTop: 6 }}>
                  <button
                    onClick={() => markPaid(bill)}
                  >
                    Mark Paid
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="panel">
        <h2>All Recurring Bills</h2>

        {recurring.length === 0 ? (
          <p>No recurring bills.</p>
        ) : (
          recurring.map((bill) => (
            <div
              key={bill.id}
              className="budgetRow"
              style={{ marginBottom: 12 }}
            >
              <div>
                <strong>{bill.name}</strong>

                <div className="txMeta">
                  {bill.frequency} • Next:{" "}
                  {bill.nextDate}
                </div>
              </div>

              <span>
                ₹{Number(bill.amount).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
