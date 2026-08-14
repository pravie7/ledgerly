export default function Reports({ transactions = [] }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const savings = income - expense;

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const monthly = months.map((name, index) => {
    const monthTx = transactions.filter(
      (t) => new Date(t.date).getMonth() === index
    );

    const monthIncome = monthTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);

    const monthExpense = monthTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);

    return {
      name,
      income: monthIncome,
      expense: monthExpense,
      savings: monthIncome - monthExpense,
    };
  });

  const categoryTotals = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + Number(t.amount);
    });

  const categories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  const topMerchants = [...transactions]
    .filter((t) => t.type === "expense")
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 10);

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
          <small>Net Savings</small>
          <h2 style={{ color: "#2563EB" }}>
            ₹{savings.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Savings Rate</small>
          <h2>
            {income === 0
              ? 0
              : Math.round((savings / income) * 100)}
            %
          </h2>
        </div>
      </div>

      <div className="panel">
        <h2>Monthly Profit & Loss</h2>

        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expense</th>
              <th>Savings</th>
            </tr>
          </thead>

          <tbody>
            {monthly.map((m) => (
              <tr key={m.name}>
                <td>{m.name}</td>
                <td style={{ color: "#16A34A" }}>
                  ₹{m.income.toLocaleString()}
                </td>
                <td style={{ color: "#DC2626" }}>
                  ₹{m.expense.toLocaleString()}
                </td>
                <td style={{ color: "#2563EB" }}>
                  ₹{m.savings.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th>Total</th>
              <th>₹{income.toLocaleString()}</th>
              <th>₹{expense.toLocaleString()}</th>
              <th>₹{savings.toLocaleString()}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Expense by Category</h2>

          {categories.length === 0 ? (
            <p>No expense data available.</p>
          ) : (
            categories.map(([cat, amount]) => {
              const pct = Math.round(
                (amount / Math.max(expense, 1)) * 100
              );

              return (
                <div key={cat} style={{ marginBottom: 18 }}>
                  <div className="budgetRow">
                    <span>{cat}</span>
                    <strong>
                      ₹{amount.toLocaleString()}
                    </strong>
                  </div>

                  <div className="progress">
                    <div style={{ width: `${pct}%` }} />
                  </div>

                  <small>{pct}% of spending</small>
                </div>
              );
            })
          )}
        </div>

        <div className="panel">
          <h2>Top 10 Merchants</h2>

          {topMerchants.length === 0 ? (
            <p>No transactions.</p>
          ) : (
            topMerchants.map((tx, index) => (
              <div
                key={tx.id}
                className="budgetRow"
                style={{ marginBottom: 14 }}
              >
                <div>
                  <strong>
                    {index + 1}. {tx.merchant}
                  </strong>

                  <div className="txMeta">
                    {tx.category}
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

      <div className="panel">
        <h2>Financial Summary</h2>

        <table>
          <tbody>
            <tr>
              <td>Total Transactions</td>
              <td>{transactions.length}</td>
            </tr>
            <tr>
              <td>Total Income</td>
              <td>₹{income.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total Expense</td>
              <td>₹{expense.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Net Savings</td>
              <td>₹{savings.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Savings Rate</td>
              <td>
                {income === 0
                  ? 0
                  : Math.round((savings / income) * 100)}
                %
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
