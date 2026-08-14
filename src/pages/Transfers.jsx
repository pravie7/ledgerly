import { useMemo, useState } from "react";

export default function Transfers({
  accounts = [],
  transactions = [],
  setTransactions,
}) {
  const [from, setFrom] = useState(accounts[0]?.name || "");
  const [to, setTo] = useState(accounts[1]?.name || "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [note, setNote] = useState("");

  const balances = useMemo(() => {
    const map = {};

    accounts.forEach((acc) => {
      map[acc.name] = Number(acc.opening || 0);
    });

    transactions.forEach((tx) => {
      if (!tx.account) return;

      if (tx.type === "income")
        map[tx.account] =
          (map[tx.account] || 0) + Number(tx.amount);

      if (tx.type === "expense")
        map[tx.account] =
          (map[tx.account] || 0) - Number(tx.amount);
    });

    return map;
  }, [accounts, transactions]);

  function transfer() {
    if (!from || !to) {
      alert("Select both accounts");
      return;
    }

    if (from === to) {
      alert("From and To accounts must be different");
      return;
    }

    const value = Number(amount);

    if (!value || value <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if ((balances[from] || 0) < value) {
      alert("Insufficient balance");
      return;
    }

    const debit = {
      id: crypto.randomUUID(),
      merchant: `Transfer to ${to}`,
      amount: value,
      type: "expense",
      category: "Transfer",
      account: from,
      note,
      date,
      transfer: true,
    };

    const credit = {
      id: crypto.randomUUID(),
      merchant: `Transfer from ${from}`,
      amount: value,
      type: "income",
      category: "Transfer",
      account: to,
      note,
      date,
      transfer: true,
    };

    setTransactions([credit, debit, ...transactions]);

    setAmount("");
    setNote("");
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Available Accounts</small>
          <h2>{accounts.length}</h2>
        </div>

        <div className="card">
          <small>Total Transfers</small>
          <h2>
            {
              transactions.filter((t) => t.transfer).length /
                2
            }
          </h2>
        </div>
      </div>

      <div className="panel">
        <h2>New Internal Transfer</h2>

        <div className="grid2">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            <option value="">From Account</option>

            {accounts.map((a) => (
              <option key={a.id}>{a.name}</option>
            ))}
          </select>

          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            <option value="">To Account</option>

            {accounts.map((a) => (
              <option key={a.id}>{a.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div style={{ gridColumn: "1 / -1" }}>
            <textarea
              rows="3"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={transfer}
          style={{ marginTop: 16 }}
        >
          Transfer Money
        </button>
      </div>

      <div className="panel">
        <h2>Live Account Balances</h2>

        {accounts.length === 0 ? (
          <p>No accounts added.</p>
        ) : (
          accounts.map((acc) => (
            <div
              key={acc.id}
              className="budgetRow"
              style={{ marginBottom: 14 }}
            >
              <div>
                <strong>{acc.name}</strong>
                <div className="txMeta">{acc.type}</div>
              </div>

              <strong>
                ₹
                {Number(
                  balances[acc.name] || 0
                ).toLocaleString()}
              </strong>
            </div>
          ))
        )}
      </div>

      <div className="panel">
        <h2>Transfer History</h2>

        {transactions.filter((t) => t.transfer).length ===
        0 ? (
          <p>No transfers yet.</p>
        ) : (
          transactions
            .filter((t) => t.transfer && t.type === "expense")
            .map((tx) => (
              <div
                key={tx.id}
                className="budgetRow"
                style={{ marginBottom: 14 }}
              >
                <div>
                  <strong>{tx.account}</strong>

                  <div className="txMeta">
                    {tx.merchant} • {tx.date}
                  </div>
                </div>

                <strong style={{ color: "#DC2626" }}>
                  ₹{Number(tx.amount).toLocaleString()}
                </strong>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
