import { useMemo, useState } from "react";
import {
  addAccount,
  getAccounts,
} from "../services/api";

export default function Accounts({
  accounts,
  setAccounts,
  transactions,
}) {
  const [form, setForm] = useState({
    name: "",
    type: "Bank",
    opening: "",
  });

  const [saving, setSaving] = useState(false);

  async function createAccount() {
    if (!form.name.trim()) return;

    setSaving(true);

    try {
      await addAccount({
        name: form.name,
        type: form.type,
        opening: Number(form.opening || 0),
      });

      const latest = await getAccounts();
      setAccounts(latest);

      setForm({
        name: "",
        type: "Bank",
        opening: "",
      });
    } catch (err) {
      alert(err.message);
    }

    setSaving(false);
  }

  const balances = useMemo(() => {
    const map = {};

    accounts.forEach((acc) => {
      map[acc.name] = Number(acc.opening || 0);
    });

    transactions.forEach((tx) => {
      const account = tx.account || "Cash";

      if (map[account] === undefined) {
        map[account] = 0;
      }

      if (tx.type === "income") {
        map[account] += Number(tx.amount);
      } else {
        map[account] -= Number(tx.amount);
      }
    });

    return map;
  }, [accounts, transactions]);

  const totalBalance = Object.values(balances).reduce(
    (sum, value) => sum + Number(value),
    0
  );

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Total Accounts</small>
          <h2>{accounts.length}</h2>
        </div>

        <div className="card">
          <small>Total Balance</small>
          <h2>₹{totalBalance.toLocaleString()}</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Create Account</h2>

        <div className="row">
          <input
            placeholder="Account Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
          >
            <option>Bank</option>
            <option>Cash</option>
            <option>Wallet</option>
            <option>Credit Card</option>
            <option>UPI</option>
          </select>
        </div>

        <div className="row">
          <input
            type="number"
            placeholder="Opening Balance"
            value={form.opening}
            onChange={(e) =>
              setForm({
                ...form,
                opening: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={createAccount}
          disabled={saving}
        >
          {saving ? "Creating..." : "Create Account"}
        </button>
      </div>

      <div className="panel">
        <h2>My Accounts</h2>

        {accounts.length === 0 ? (
          <p style={{ color: "#64748b" }}>
            No accounts created yet.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Type</th>
                <th>Opening</th>
                <th>Current Balance</th>
              </tr>
            </thead>

            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.id}>
                  <td>
                    <strong>{acc.name}</strong>
                  </td>

                  <td>{acc.type}</td>

                  <td>
                    ₹
                    {Number(
                      acc.opening || 0
                    ).toLocaleString()}
                  </td>

                  <td
                    style={{
                      color:
                        balances[acc.name] >= 0
                          ? "#16a34a"
                          : "#dc2626",
                      fontWeight: 700,
                    }}
                  >
                    ₹
                    {Number(
                      balances[acc.name] || 0
                    ).toLocaleString()}
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
