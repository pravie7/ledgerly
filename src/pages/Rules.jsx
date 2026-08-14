import { useState } from "react";

export default function Rules({
  rules = [],
  setRules,
  categories = [],
}) {
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState(
    categories[0] || "Shopping"
  );

  function addRule() {
    if (!merchant.trim()) return;

    const exists = rules.some(
      (r) =>
        r.merchant.toLowerCase() === merchant.toLowerCase()
    );

    if (exists) {
      alert("Rule already exists.");
      return;
    }

    const newRule = {
      id: crypto.randomUUID(),
      merchant: merchant.trim(),
      category,
    };

    setRules([...rules, newRule]);

    setMerchant("");
    setCategory(categories[0] || "Shopping");
  }

  function deleteRule(id) {
    setRules(rules.filter((r) => r.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="panel">
        <h2>Merchant Auto-Categorization</h2>

        <p
          style={{
            color: "#64748B",
            marginBottom: 18,
          }}
        >
          Create reusable rules that automatically assign a
          category when importing bank statements.
        </p>

        <div className="row">
          <input
            placeholder="Merchant (e.g. Swiggy)"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <button onClick={addRule}>Add Rule</button>
      </div>

      <div className="panel">
        <h2>Active Rules</h2>

        {rules.length === 0 ? (
          <p>No rules created yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Category</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td>{rule.merchant}</td>
                  <td>{rule.category}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => deleteRule(rule.id)}
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
        <h2>Recommended Starter Rules</h2>

        <table>
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Swiggy</td>
              <td>Dining</td>
            </tr>
            <tr>
              <td>Zomato</td>
              <td>Dining</td>
            </tr>
            <tr>
              <td>Amazon</td>
              <td>Shopping</td>
            </tr>
            <tr>
              <td>Uber</td>
              <td>Transportation</td>
            </tr>
            <tr>
              <td>Indian Oil</td>
              <td>Transportation</td>
            </tr>
            <tr>
              <td>Netflix</td>
              <td>Subscriptions</td>
            </tr>
            <tr>
              <td>Spotify</td>
              <td>Subscriptions</td>
            </tr>
            <tr>
              <td>Salary</td>
              <td>Income</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
