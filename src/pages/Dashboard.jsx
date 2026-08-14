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
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);

  transactions.forEach((tx) => {
    const month = new Date(tx.date).getMonth();

    if (tx.type === "income") {
      monthlyIncome[month] += Number(tx.amount);
    } else {
      monthlyExpense[month] += Number(tx.amount);
    }
  });

  const categoryMap = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + Number(t.amount);
    });

  const categories = Object.entries(categoryMap).sort(
    (a, b) => b[1] - a[1]
  );

  const maxValue = Math.max(
    ...monthlyIncome,
    ...monthlyExpense,
    1
  );

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
          <h2>Monthly Income vs Expense</h2>

          <svg viewBox="0 0 360 180" width="100%" height="180">
            <line
              x1="30"
              y1="10"
              x2="30"
              y2="150"
              stroke="#CBD5E1"
            />

            <line
              x1="30"
              y1="150"
              x2="340"
              y2="150"
              stroke="#CBD5E1"
            />

            {months.map((m, i) => {
              const x = 40 + i * 25;
              const incomeH =
                (monthlyIncome[i] / maxValue) * 120;
              const expenseH =
                (monthlyExpense[i] / maxValue) * 120;

              return (
                <g key={m}>
                  <rect
                    x={x}
                    y={150 - incomeH}
                    width="8"
                    height={incomeH}
                    fill="#16A34A"
                    rx="2"
                  />

                  <rect
                    x={x + 10}
                    y={150 - expenseH}
                    width="8"
                    height={expenseH}
                    fill="#DC2626"
                    rx="2"
                  />

                  <text
                    x={x + 8}
                    y="165"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#64748B"
                  >
                    {m}
                  </text>
                </g>
              );
            })}
          </svg>

          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 12,
              fontSize: 13,
            }}
          >
            <div>
              🟢 Income
            </div>
            <div>
              🔴 Expense
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>Spending by Category</h2>

          {categories.length === 0 ? (
            <p>No expense data.</p>
          ) : (
            categories.map(([cat, amount]) => {
              const pct = Math.round(
                (amount / spending) * 100
              );

              return (
                <div
                  key={cat}
                  style={{ marginBottom: 18 }}
                >
                  <div className="budgetRow">
                    <span>{cat}</span>

                    <strong>
                      ₹{amount.toLocaleString()}
                    </strong>
                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width: `${pct}%`,
                      }}
                    />
                  </div>

                  <small>{pct}%</small>
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
          <h2>Top Merchants</h2>

          {transactions.length === 0 ? (
            <p>No transactions.</p>
          ) : (
            [...transactions]
              .sort(
                (a, b) =>
                  Number(b.amount) - Number(a.amount)
              )
              .slice(0, 5)
              .map((tx) => (
                <div
                  key={tx.id}
                  className="budgetRow"
                  style={{ marginBottom: 14 }}
                >
                  <div>
                    <strong>{tx.merchant}</strong>

                    <div className="txMeta">
                      {tx.category}
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
        <h2>Recent Transactions</h2>

        {transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          [...transactions]
            .slice(0, 6)
            .map((tx) => (
              <div
                key={tx.id}
                className="budgetRow"
                style={{ marginBottom: 16 }}
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
  );
}
