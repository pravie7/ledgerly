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
  const recent = [...transactions].slice(0, 5);

  const budgetProgress = budgets.map((budget) => {
    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === budget.category
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const percentage =
      budget.limit > 0
        ? Math.min(100, Math.round((spent / budget.limit) * 100))
        : 0;

    return {
      ...budget,
      spent,
      percentage,
    };
  });

  const activeGoals = goals.slice(0, 3);

  const monthlyExpense = Array(6).fill(0);

  transactions.forEach((t) => {
    if (t.type !== "expense") return;

    const month = new Date(t.date).getMonth();
    monthlyExpense[month % 6] += Number(t.amount);
  });

  const max = Math.max(...monthlyExpense, 1);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

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
          <h2>Financial Health</h2>

          <div className="healthItem">
            <span>Savings Rate</span>
            <strong>{savingsRate}%</strong>
          </div>

          <div className="progress">
            <div
              style={{
                width: `${Math.min(100, savingsRate)}%`,
                background: "#2563EB",
              }}
            />
          </div>

          <div className="healthItem">
            <span>Total Transactions</span>
            <strong>{transactions.length}</strong>
          </div>

          <div className="healthItem">
            <span>Budgets</span>
            <strong>{budgets.length}</strong>
          </div>

          <div className="healthItem">
            <span>Goals</span>
            <strong>{goals.length}</strong>
          </div>
        </div>

        <div className="panel">
          <h2>Monthly Expenses</h2>

          <div className="chart">
            {monthlyExpense.map((value, i) => (
              <div className="barCol" key={i}>
                <div
                  className="bar"
                  style={{
                    height: `${(value / max) * 140}px`,
                  }}
                />
                <small>{months[i]}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Budget Progress</h2>

          {budgetProgress.length === 0 ? (
            <p>No budgets created.</p>
          ) : (
            budgetProgress.map((b) => (
              <div key={b.id} className="budgetItem">
                <div className="budgetRow">
                  <strong>{b.category}</strong>

                  <span>
                    ₹{b.spent.toLocaleString()} / ₹
                    {b.limit.toLocaleString()}
                  </span>
                </div>

                <div className="progress">
                  <div
                    style={{
                      width: `${b.percentage}%`,
                      background:
                        b.percentage >= 100
                          ? "#DC2626"
                          : "#6558D3",
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <h2>Top Goals</h2>

          {activeGoals.length === 0 ? (
            <p>No goals available.</p>
          ) : (
            activeGoals.map((goal) => {
              const percent = Math.min(
                100,
                Math.round((goal.saved / goal.target) * 100)
              );

              return (
                <div key={goal.id} className="goalItem">
                  <div className="budgetRow">
                    <strong>{goal.name}</strong>
                    <span>{percent}%</span>
                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width: `${percent}%`,
                        background: "#16A34A",
                      }}
                    />
                  </div>

                  <small>
                    ₹{goal.saved.toLocaleString()} of ₹
                    {goal.target.toLocaleString()}
                  </small>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Recent Transactions</h2>

        {recent.length === 0 ? (
          <p>No transactions recorded.</p>
        ) : (
          recent.map((t) => (
            <div className="tx" key={t.id}>
              <div>
                <strong>{t.merchant}</strong>
                <div className="txMeta">
                  {t.category} • {t.date}
                </div>
              </div>

              <div
                className={
                  t.type === "income" ? "income" : "expense"
                }
              >
                {t.type === "income" ? "+" : "-"}₹
                {Number(t.amount).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
