export default function Reports({ transactions = [] }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const profit = income - expense;

  const categories = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categories[t.category] =
        (categories[t.category] || 0) + Number(t.amount);
    });

  const rows = Object.entries(categories).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Total Income</small>
          <h2 style={{ color: "#16A34A" }}>
            ₹{income.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Total Expense</small>
          <h2 style={{ color: "#DC2626" }}>
            ₹{expense.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Net Profit</small>
          <h2 style={{ color: "#2563EB" }}>
            ₹{profit.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="panel">
        <h2>Expense by Category</h2>

        {rows.length === 0 ? (
          <p>No expense data.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th align="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([cat, amount]) => (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td>₹{amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <h2>Monthly Profit & Loss</h2>

        <table>
          <tbody>
            <tr>
              <td>Total Income</td>
              <td>₹{income.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total Expense</td>
              <td>₹{expense.toLocaleString()}</td>
            </tr>
            <tr>
              <td>
                <strong>Net Savings</strong>
              </td>
              <td>
                <strong>₹{profit.toLocaleString()}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
