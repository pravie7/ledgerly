import { useMemo, useState } from "react";

export default function Accounts({
  accounts = [],
  setAccounts,
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Savings");
  const [balance, setBalance] = useState("");

  const totalBalance = useMemo(
    () =>
      accounts.reduce(
        (sum, acc) => sum + Number(acc.balance),
        0
      ),
    [accounts]
  );

  function addAccount() {
    if (!name.trim() || balance === "") return;

    const newAccount = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      balance: Number(balance),
    };

    setAccounts([...accounts, newAccount]);

    setName("");
    setType("Savings");
    setBalance("");
  }

  function deleteAccount(id) {
    setAccounts(accounts.filter((a) => a.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Total Accounts</small>
          <h2>{accounts.length}</h2>
        </div>

        <div className="card">
          <small>Total Balance</small>
          <h2 style={{ color: "#16A34A" }}>
            ₹{totalBalance.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Add Bank Account</h2>

          <div className="row">
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
          </div>

          <input
            type="number"
            placeholder="Opening Balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />

          <button
            onClick={addAccount}
            style={{ marginTop: 16 }}
          >
            Add Account
          </button>
        </div>

        <div className="panel">
          <h2>Account Summary</h2>

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
                  <div className="txMeta">
                    {acc.type}
                  </div>
                </div>

                <strong>
                  ₹{Number(acc.balance).toLocaleString()}
                </strong>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Manage Accounts</h2>

        {accounts.length === 0 ? (
          <p>No accounts available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Type</th>
                <th>Balance</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.name}</td>
                  <td>{acc.type}</td>
                  <td>
                    ₹{Number(acc.balance).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="delete"
                      onClick={() =>
                        deleteAccount(acc.id)
                      }
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
