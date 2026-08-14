import { useMemo, useState } from "react";

const merchants = [
  "Swiggy",
  "Zomato",
  "Amazon",
  "Flipkart",
  "Indian Oil",
  "Uber",
  "Netflix",
  "Salary",
  "Other",
];

export default function Rules({
  rules,
  setRules,
  categories,
}) {
  const [merchant, setMerchant] = useState("Swiggy");
  const [category, setCategory] = useState(
    categories[0] || "Other"
  );

  const sortedRules = useMemo(() => {
    return [...rules].sort((a, b) =>
      a.merchant.localeCompare(b.merchant)
    );
  }, [rules]);

  function addRule() {
    if (!merchant) return;

    const exists = rules.find(
      (r) =>
        r.merchant.toLowerCase() === merchant.toLowerCase()
    );

    if (exists) {
      alert("Rule already exists");
      return;
    }

    const rule = {
      id: crypto.randomUUID(),
      merchant,
      category,
      enabled: true,
    };

    setRules([rule, ...rules]);
  }

  function toggle(id) {
    setRules(
      rules.map((r) =>
        r.id === id
          ? { ...r, enabled: !r.enabled }
          : r
      )
    );
  }

  function remove(id) {
    if (!confirm("Delete rule?")) return;
    setRules(rules.filter((r) => r.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Total Rules</small>
          <h2>{rules.length}</h2>
        </div>

        <div className="card">
          <small>Enabled</small>
          <h2>
            {rules.filter((r) => r.enabled).length}
          </h2>
        </div>

        <div className="card">
          <small>Disabled</small>
          <h2>
            {rules.filter((r) => !r.enabled).length}
          </h2>
        </div>

        <div className="card">
          <small>Automation</small>
          <h2 style={{ color: "#16A34A" }}>
            Active
          </h2>
        </div>
      </div>

      <div className="panel">
        <h2>Create Auto Categorization Rule</h2>

        <div className="row">
          <select
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          >
            {merchants.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <button onClick={addRule}>
          Create Rule
        </button>

        <div style={{ marginTop: 16 }}>
          <small style={{ color: "#6B7280" }}>
            Example: Amazon → Shopping, Swiggy →
            Dining, Salary → Income
          </small>
        </div>
      </div>

      <div className="panel">
        <h2>Automation Rules</h2>

        {sortedRules.length === 0 ? (
          <p>No rules configured.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Category</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {sortedRules.map((rule) => (
                <tr key={rule.id}>
                  <td>
                    <strong>{rule.merchant}</strong>
                  </td>

                  <td>{rule.category}</td>

                  <td>
                    <button
                      className={
                        rule.enabled
                          ? "secondary"
                          : "delete"
                      }
                      onClick={() => toggle(rule.id)}
                    >
                      {rule.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </td>

                  <td>
                    <button
                      className="delete"
                      onClick={() => remove(rule.id)}
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

      <div className="panel">
        <h2>Suggested Rules</h2>

        <div className="budgetCard">
          <div className="budgetRow">
            <strong>Swiggy</strong>
            <span>Dining</span>
          </div>
        </div>

        <div className="budgetCard">
          <div className="budgetRow">
            <strong>Amazon</strong>
            <span>Shopping</span>
          </div>
        </div>

        <div className="budgetCard">
          <div className="budgetRow">
            <strong>Indian Oil</strong>
            <span>Transportation</span>
          </div>
        </div>

        <div className="budgetCard">
          <div className="budgetRow">
            <strong>Salary</strong>
            <span>Income</span>
          </div>
        </div>
      </div>
    </div>
  );
}
