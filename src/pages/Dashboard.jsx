import SummaryCard from "../components/SummaryCard";

export default function Dashboard({
  transactions,
  income,
  spending,
  savings,
  savingsRate,
  netWorth,
  netWorthConfigured,
  budgets,
  goals,
}) {
  const monthly = Array(12).fill(0);

  transactions.forEach((t) => {
    if (t.type === "expense") {
      const month = new Date(t.date).getMonth();
      monthly[month] += Number(t.amount);
    }
  });

  const categoryTotals = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + Number(t.amount);
    });

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recent = [...transactions].slice(0, 5);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const maxExpense = Math.max(...monthly, 1);

  return (
    <div className="dashboard">
      <div className="cards">
        <SummaryCard
          title="Income"
          value={`₹${income.toLocaleString()}`}
          color="#16A34A"
        />

        <SummaryCard
          title="Spending"
          value={`₹${spending.toLocaleString()}`}
          color="#DC2626"
        />

        <SummaryCard
          title="Savings"
          value={`₹${savings.toLocaleString()}`}
          color="#2563EB"
          subtitle={`${savingsRate}% saved`}
        />

        <SummaryCard
          title="Net Worth"
          value={
            netWorthConfigured
              ? `₹${netWorth.toLocaleString()}`
              : "Setup"
          }
          color="#7C3AED"
        />
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Monthly Expenses</h2>

          <div className="chartBars">
            {monthly.map((value, i) => (
              <div className="barItem" key={i}>
                <div
                  className="bar"
                  style={{
                    height: `${(value / maxExpense) * 140}px`,
                  }}
                />
                <small>{months[i]}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Top Spending Categories</h2>

          {topCategories.length === 0 ? (
            <p>No expense data.</p>
          ) : (
            topCategories.map(([cat, amount]) => {
              const pct = Math.round(
                (amount / spending) * 100
              );

              return (
                <div
                  key={cat}
                  style={{ marginBottom: 16 }}
                >
                  <div className="budgetRow">
                    <span>{cat}</span>
                    <strong>
                      ₹{amount.toLocaleString()}
                    </strong>
                  </div>

                  <div className="progress">
                    <div
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Financial Health</h2>

          <div className="healthGrid">
            <div>
              <span>Savings Rate</span>
              <h3>{savingsRate}%</h3>
            </div>

            <div>
              <span>Transactions</span>
              <h3>{transactions.length}</h3>
            </div>

            <div>
              <span>Budgets</span>
              <h3>{budgets.length}</h3>
            </div>

            <div>
              <span>Goals</span>
              <h3>{goals.length}</h3>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>Recent Transactions</h2>

          {recent.length === 0 ? (
            <p>No transactions available.</p>
          ) : (
            recent.map((tx) => (
              <div
                key={tx.id}
                className="budgetRow"
                style={{ marginBottom: 14 }}
              >
                <div>
                  <strong>{tx.merchant}</strong>
                  <div className="txMeta">
                    {tx.category} • {tx.date}
                  </div>
                </div>

                <strong
                  className={
                    tx.type === "income"
                      ? "income"
                      : "expense"
                  }
                >
                  {tx.type === "income" ? "+" : "-"}₹
                  {Number(tx.amount).toLocaleString()}
                </strong>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Budget Progress</h2>

        {budgets.length === 0 ? (
          <p>No budgets created.</p>
        ) : (
          budgets.map((b) => {
            const spent = transactions
              .filter(
                (t) =>
                  t.type === "expense" &&
                  t.category === b.category
              )
              .reduce(
                (s, t) => s + Number(t.amount),
                0
              );

            const pct = Math.min(
              100,
              Math.round((spent / b.limit) * 100)
            );

            return (
              <div
                key={b.id}
                style={{ marginBottom: 18 }}
              >
                <div className="budgetRow">
                  <span>{b.category}</span>
                  <strong>
                    ₹{spent} / ₹{b.limit}
                  </strong>
                </div>

                <div className="progress">
                  <div
                    style={{
                      width: `${pct}%`,
                      background:
                        pct > 90
                          ? "#DC2626"
                          : "#16A34A",
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
