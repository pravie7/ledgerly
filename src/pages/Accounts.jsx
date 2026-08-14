import { useMemo, useState } from "react";

export default function Accounts({
  accounts = [],
  setAccounts,
  transactions = [],
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Savings");
  const [opening, setOpening] = useState("");

  const liveAccounts = useMemo(() => {
    return accounts.map((acc) => {
      const movement = transactions
        .filter((t) => t.account === acc.name)
        .reduce((sum, tx) => {
          return tx.type === "income"
            ? sum + Number(tx.amount)
            : sum - Number(tx.amount);
        }, 0);

      return {
        ...acc,
        liveBalance: Number(acc.opening) + movement,
      };
    });
  }, [accounts, transactions]);

  const totalBalance = liveAccounts.reduce(
    (s, a) => s + a.liveBalance,
    0
  );

  function addAccount() {
    if (!name.trim() || opening === "") return;

    setAccounts([
      ...accounts,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        type,
        opening: Number(opening),
      },
    ]);

    setName("");
    setType("Savings");
    setOpening("");
  }

  function remove(id) {
    setAccounts(accounts.filter((a) => a.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Accounts</small>
          <h2>{accounts.length}</h2>
        </div>

        <div className="card">
          <small>Live Balance</small>
          <h2 style={{ color: "#16A34A" }}>
            ₹{totalBalance.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Add Account</h2>

          <input
            placeholder="HDFC Salary"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Savings</option>
            <option>Current</option>
            <option>Cash</option>
            <option>Credit Card</option>
          </select>

          <input
            type="number"
            placeholder="Opening Balance"
            value={opening}
            onChange={(e) => setOpening(e.target.value)}
          />

          <button
            onClick={addAccount}
            style={{ marginTop: 16 }}
          >
            Add Account
          </button>
        </div>

        <div className="panel">
          <h2>Live Accounts</h2>

          {liveAccounts.map((acc) => (
            <div
              key={acc.id}
              className="budgetRow"
              style={{ marginBottom: 16 }}
            >
              <div>
                <strong>{acc.name}</strong>
                <div className="txMeta">{acc.type}</div>
              </div>

              <strong>
                ₹{acc.liveBalance.toLocaleString()}
              </strong>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Manage</h2>

        <table>
          <thead>
            <tr>
              <th>Account</th>
              <th>Opening</th>
              <th>Live</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {liveAccounts.map((acc) => (
              <tr key={acc.id}>
                <td>{acc.name}</td>
                <td>₹{acc.opening.toLocaleString()}</td>
                <td>₹{acc.liveBalance.toLocaleString()}</td>
                <td>
                  <button
                    className="delete"
                    onClick={() => remove(acc.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
