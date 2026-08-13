import { useMemo } from "react";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

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
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      })
      .slice(0, 5);
  }, [transactions]);

  const budgetCount = budgets.length;
  const goalCount = goals.length;

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Good to see you.</h1>

          <p>
            Your financial overview, based only on saved data.
          </p>
        </div>
      </section>

      <section className="statGrid">
        <div className="statCard">
          <span className="statLabel">Income</span>
          <strong className="statValue positive">
            {formatCurrency(income)}
          </strong>
          <span className="statHint">
            From recorded transactions
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">Spending</span>
          <strong className="statValue">
            {formatCurrency(spending)}
          </strong>
          <span className="statHint">
            From recorded expenses
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">Savings</span>
          <strong
            className={
              savings >= 0
                ? "statValue positive"
                : "statValue negative"
            }
          >
            {formatCurrency(savings)}
          </strong>
          <span className="statHint">
            Savings rate: {savingsRate}%
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">Net Worth</span>

          <strong className="statValue">
            {netWorthConfigured
              ? formatCurrency(netWorth)
              : "Not set"}
          </strong>

          <span className="statHint">
            {netWorthConfigured
              ? "Assets minus liabilities"
              : "Configure in Settings"}
          </span>
        </div>
      </section>

      <section className="dashboardGrid">
        <div className="panel">
          <div className="panelHeader">
            <div>
              <h2>Recent Transactions</h2>
              <p>Your latest recorded activity.</p>
            </div>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIcon">↕</div>
              <h3>No transactions yet</h3>
              <p>
                Add your first income or expense from the
                Transactions page.
              </p>
            </div>
          ) : (
            <div className="transactionList">
              {recentTransactions.map((transaction) => (
                <div
                  className="transactionListItem"
                  key={transaction.id}
                >
                  <div>
                    <strong>{transaction.merchant}</strong>

                    <span>
                      {transaction.category} ·{" "}
                      {transaction.date}
                    </span>
                  </div>

                  <strong
                    className={
                      transaction.type === "income"
                        ? "positive"
                        : ""
                    }
                  >
                    {transaction.type === "income"
                      ? "+"
                      : "-"}
                    {formatCurrency(transaction.amount)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panelHeader">
            <div>
              <h2>Financial Setup</h2>
              <p>Your current Ledgerly configuration.</p>
            </div>
          </div>

          <div className="setupList">
            <div className="setupItem">
              <span>Budgets</span>
              <strong>{budgetCount}</strong>
            </div>

            <div className="setupItem">
              <span>Goals</span>
              <strong>{goalCount}</strong>
            </div>

            <div className="setupItem">
              <span>Transactions</span>
              <strong>{transactions.length}</strong>
            </div>
          </div>

          {transactions.length === 0 &&
            budgets.length === 0 &&
            goals.length === 0 && (
              <div className="infoNotice">
                Ledgerly is ready for your real financial
                data. Nothing has been pre-filled.
              </div>
            )}
        </div>
      </section>
    </div>
  );
}
