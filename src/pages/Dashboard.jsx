import { useMemo } from "react";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function Dashboard({
  transactions = [],
  income = 0,
  spending = 0,
  savings = 0,
  savingsRate = 0,
  netWorth = 0,
  netWorthConfigured = false,
  budgets = [],
  goals = [],
}) {
  const safeTransactions = safeArray(transactions);
  const safeBudgets = safeArray(budgets);
  const safeGoals = safeArray(goals);

  const recentTransactions = useMemo(() => {
    return [...safeTransactions]
      .sort((a, b) => {
        return new Date(b.date || 0) - new Date(a.date || 0);
      })
      .slice(0, 5);
  }, [safeTransactions]);

  const spendingByCategory = useMemo(() => {
    const categoryMap = {};

    safeTransactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        const category = transaction.category || "Other";
        const amount = Number(transaction.amount || 0);

        categoryMap[category] =
          (categoryMap[category] || 0) + amount;
      });

    return Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [safeTransactions]);

  const totalCategorySpending = useMemo(() => {
    return spendingByCategory.reduce(
      (total, [, amount]) => total + amount,
      0
    );
  }, [spendingByCategory]);

  const topBudgetStatus = useMemo(() => {
    if (safeBudgets.length === 0) {
      return [];
    }

    return safeBudgets.slice(0, 4).map((budget) => {
      const category =
        budget.category || budget.name || "Other";

      const limit = Number(
        budget.limit || budget.amount || 0
      );

      const spent = safeTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category === category
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount || 0),
          0
        );

      const percentage =
        limit > 0
          ? Math.min(100, Math.round((spent / limit) * 100))
          : 0;

      return {
        id: budget.id || category,
        category,
        limit,
        spent,
        percentage,
        exceeded: limit > 0 && spent > limit,
      };
    });
  }, [safeBudgets, safeTransactions]);

  const topGoals = useMemo(() => {
    return safeGoals.slice(0, 4).map((goal) => {
      const target = Number(goal.target || 0);
      const saved = Number(goal.saved || 0);

      const percentage =
        target > 0
          ? Math.min(100, Math.round((saved / target) * 100))
          : 0;

      return {
        id: goal.id || goal.name,
        name: goal.name || "Savings Goal",
        target,
        saved,
        percentage,
        remaining: Math.max(0, target - saved),
      };
    });
  }, [safeGoals]);

  const overallGoalProgress = useMemo(() => {
    if (safeGoals.length === 0) {
      return 0;
    }

    const totalTarget = safeGoals.reduce(
      (total, goal) => total + Number(goal.target || 0),
      0
    );

    const totalSaved = safeGoals.reduce(
      (total, goal) => total + Number(goal.saved || 0),
      0
    );

    if (totalTarget <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((totalSaved / totalTarget) * 100)
    );
  }, [safeGoals]);

  const budgetWarningCount = topBudgetStatus.filter(
    (budget) => budget.exceeded
  ).length;

  const hasFinancialData =
    safeTransactions.length > 0 ||
    safeBudgets.length > 0 ||
    safeGoals.length > 0 ||
    netWorthConfigured;

  return (
    <>
      <div className="pageStack">
        {/* HERO */}
        <section className="heroSection">
          <div>
            <h1>Good to see you.</h1>

            <p>
              Your financial overview, based only on saved data.
            </p>
          </div>
        </section>

        {/* MAIN FINANCIAL STATS */}
        <section className="statGrid">
          <div className="statCard">
            <span className="statLabel">Income</span>

            <strong className="statValue positive">
              {formatCurrency(income)}
            </strong>

            <span className="statHint">
              From recorded income
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
                Number(savings) >= 0
                  ? "statValue positive"
                  : "statValue negative"
              }
            >
              {formatCurrency(savings)}
            </strong>

            <span className="statHint">
              Savings rate: {Number(savingsRate || 0)}%
            </span>
          </div>

          <div className="statCard">
            <span className="statLabel">Net Worth</span>

            <strong
              className={
                netWorthConfigured
                  ? "statValue"
                  : "statValue mutedValue"
              }
            >
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

        {/* RECENT TRANSACTIONS + FINANCIAL SETUP */}
        <section className="dashboardGrid">
          <div className="panel">
            <div className="panelHeader">
              <div>
                <h2>Recent Transactions</h2>

                <p>Your latest recorded activity.</p>
              </div>

              <span className="dashboardCount">
                {safeTransactions.length}
              </span>
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
                      <strong>
                        {transaction.merchant ||
                          "Unnamed transaction"}
                      </strong>

                      <span>
                        {transaction.category ||
                          "Other"}{" "}
                        · {transaction.date || "No date"}
                      </span>
                    </div>

                    <strong
                      className={
                        transaction.type === "income"
                          ? "positive"
                          : "negativeAmount"
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
                <strong>{safeBudgets.length}</strong>
              </div>

              <div className="setupItem">
                <span>Goals</span>
                <strong>{safeGoals.length}</strong>
              </div>

              <div className="setupItem">
                <span>Transactions</span>
                <strong>{safeTransactions.length}</strong>
              </div>
            </div>

            {!hasFinancialData && (
              <div className="infoNotice">
                Ledgerly is ready for your real financial
                data. Nothing has been pre-filled.
              </div>
            )}

            {budgetWarningCount > 0 && (
              <div className="warningNotice">
                ⚠️ {budgetWarningCount} budget
                {budgetWarningCount > 1 ? "s" : ""} currently
                exceeded.
              </div>
            )}
          </div>
        </section>

        {/* SPENDING ANALYSIS */}
        <section className="dashboardGrid">
          <div className="panel">
            <div className="panelHeader">
              <div>
                <h2>Spending by Category</h2>

                <p>
                  Where your recorded expenses are going.
                </p>
              </div>
            </div>

            {spendingByCategory.length === 0 ? (
              <div className="compactEmptyState">
                <span>No expense data available yet.</span>
              </div>
            ) : (
              <div className="categoryList">
                {spendingByCategory.map(
                  ([category, amount]) => {
                    const percentage =
                      totalCategorySpending > 0
                        ? Math.round(
                            (amount /
                              totalCategorySpending) *
                              100
                          )
                        : 0;

                    return (
                      <div
                        className="categoryItem"
                        key={category}
                      >
                        <div className="categoryTop">
                          <span>{category}</span>

                          <strong>
                            {formatCurrency(amount)}
                          </strong>
                        </div>

                        <div className="categoryBar">
                          <div
                            className="categoryBarFill"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <small>
                          {percentage}% of recorded
                          spending
                        </small>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* GOALS */}
          <div className="panel">
            <div className="panelHeader">
              <div>
                <h2>Goals Progress</h2>

                <p>
                  Track how close you are to your savings
                  targets.
                </p>
              </div>

              {safeGoals.length > 0 && (
                <strong className="dashboardPercentage">
                  {overallGoalProgress}%
                </strong>
              )}
            </div>

            {topGoals.length === 0 ? (
              <div className="compactEmptyState">
                <span>
                  No savings goals created yet.
                </span>
              </div>
            ) : (
              <div className="goalDashboardList">
                {topGoals.map((goal) => (
                  <div
                    className="goalDashboardItem"
                    key={goal.id}
                  >
                    <div className="categoryTop">
                      <span>{goal.name}</span>

                      <strong>
                        {goal.percentage}%
                      </strong>
                    </div>

                    <div className="categoryBar">
                      <div
                        className="goalBarFill"
                        style={{
                          width: `${goal.percentage}%`,
                        }}
                      />
                    </div>

                    <small>
                      {formatCurrency(goal.saved)} of{" "}
                      {formatCurrency(goal.target)}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* BUDGET STATUS */}
        <section className="panel">
          <div className="panelHeader">
            <div>
              <h2>Budget Status</h2>

              <p>
                Monitor your spending against your budgets.
              </p>
            </div>
          </div>

          {topBudgetStatus.length === 0 ? (
            <div className="compactEmptyState">
              <span>
                No budgets created yet.
              </span>
            </div>
          ) : (
            <div className="budgetDashboardGrid">
              {topBudgetStatus.map((budget) => (
                <div
                  className="budgetDashboardCard"
                  key={budget.id}
                >
                  <div className="categoryTop">
                    <strong>{budget.category}</strong>

                    <span
                      className={
                        budget.exceeded
                          ? "budgetExceeded"
                          : "budgetHealthy"
                      }
                    >
                      {budget.percentage}%
                    </span>
                  </div>

                  <div className="categoryBar">
                    <div
                      className={
                        budget.exceeded
                          ? "budgetBarFill exceeded"
                          : "budgetBarFill"
                      }
                      style={{
                        width: `${budget.percentage}%`,
                      }}
                    />
                  </div>

                  <div className="budgetDashboardAmounts">
                    <span>
                      Spent{" "}
                      <strong>
                        {formatCurrency(budget.spent)}
                      </strong>
                    </span>

                    <span>
                      Limit{" "}
                      <strong>
                        {formatCurrency(budget.limit)}
                      </strong>
                    </span>
                  </div>

                  <small
                    className={
                      budget.exceeded
                        ? "budgetExceeded"
                        : "budgetHealthy"
                    }
                  >
                    {budget.exceeded
                      ? `Exceeded by ${formatCurrency(
                          budget.spent -
                            budget.limit
                        )}`
                      : `${formatCurrency(
                          budget.limit -
                            budget.spent
                        )} remaining`}
                  </small>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Dashboard-specific styling */}
      <style>{`
        .dashboardCount {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 28px;
          padding: 0 8px;
          border-radius: 999px;
          background: #F3F4F6;
          color: #374151;
          font-size: 13px;
          font-weight: 700;
        }

        .mutedValue {
          color: #9CA3AF;
        }

        .negativeAmount {
          color: #DC2626;
        }

        .dashboardPercentage {
          font-size: 18px;
        }

        .compactEmptyState {
          padding: 24px 4px;
          color: #6B7280;
          font-size: 14px;
        }

        .categoryList {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .categoryItem {
          width: 100%;
        }

        .categoryTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 7px;
        }

        .categoryTop span {
          color: #374151;
        }

        .categoryTop strong {
          color: #111827;
        }

        .categoryBar {
          width: 100%;
          height: 9px;
          background: #E5E7EB;
          border-radius: 999px;
          overflow: hidden;
        }

        .categoryBarFill {
          height: 100%;
          background: #6558D3;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .goalBarFill {
          height: 100%;
          background: #16A34A;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .categoryItem small,
        .goalDashboardItem small {
          display: block;
          margin-top: 6px;
          color: #9CA3AF;
          font-size: 12px;
        }

        .goalDashboardList {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .goalDashboardItem {
          width: 100%;
        }

        .budgetDashboardGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .budgetDashboardCard {
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 16px;
        }

        .budgetDashboardAmounts {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin: 10px 0 7px;
          color: #6B7280;
          font-size: 13px;
        }

        .budgetDashboardAmounts strong {
          color: #111827;
        }

        .budgetBarFill {
          height: 100%;
          background: #6558D3;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .budgetBarFill.exceeded {
          background: #DC2626;
        }

        .budgetHealthy {
          color: #16A34A;
          font-weight: 600;
        }

        .budgetExceeded {
          color: #DC2626;
          font-weight: 600;
        }

        .warningNotice {
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          background: #FEF2F2;
          color: #B91C1C;
          font-size: 14px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .budgetDashboardGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .budgetDashboardAmounts {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
}
