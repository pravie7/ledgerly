import { useMemo, useState } from "react";

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

function currency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function Budgets({
  budgets,
  setBudgets,
  transactions,
  categories,
}) {
  const [category, setCategory] =
    useState("Groceries");

  const [limit, setLimit] = useState("");

  const spending = useMemo(() => {
    const map = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] =
          (map[t.category] || 0) + Number(t.amount);
      });

    return map;
  }, [transactions]);

  function createBudget(event) {
    event.preventDefault();

    const numericLimit = Number(limit);

    if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
      alert("Enter a valid monthly budget.");
      return;
    }

    if (
      budgets.some(
        (budget) => budget.category === category
      )
    ) {
      alert("A budget already exists for this category.");
      return;
    }

    setBudgets([
      ...budgets,
      {
        id: createId(),
        category,
        limit: numericLimit,
        active: true,
      },
    ]);

    setLimit("");
  }

  function deleteBudget(id) {
    if (!window.confirm("Delete this budget?")) {
      return;
    }

    setBudgets(
      budgets.filter((budget) => budget.id !== id)
    );
  }

  return (
    <div className="pageStack">
      <form
        className="panel"
        onSubmit={createBudget}
      >
        <div className="panelHeader">
          <div>
            <h2>Create Monthly Budget</h2>
            <p>
              Set a limit and Ledgerly will compare it
              with your real expenses.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <label>
            Category
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories
                .filter((item) => item !== "Income")
                .map((item) => (
                  <option key={item}>{item}</option>
                ))}
            </select>
          </label>

          <label>
            Monthly Limit
            <input
              type="number"
              min="1"
              step="1"
              placeholder="₹0"
              value={limit}
              onChange={(event) =>
                setLimit(event.target.value)
              }
            />
          </label>
        </div>

        <button className="primaryButton" type="submit">
          Create Budget
        </button>
      </form>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Budget Overview</h2>
            <p>
              Spending is calculated from your
              transactions.
            </p>
          </div>
        </div>

        {budgets.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">▣</div>
            <h3>No budgets created</h3>
            <p>
              Create a monthly budget to start tracking
              category spending.
            </p>
          </div>
        ) : (
          <div className="budgetGrid">
            {budgets.map((budget) => {
              const spent =
                spending[budget.category] || 0;

              const percentage =
                budget.limit > 0
                  ? Math.round(
                      (spent / budget.limit) * 100
                    )
                  : 0;

              const displayPercentage = Math.min(
                percentage,
                100
              );

              const remaining =
                budget.limit - spent;

              const exceeded = remaining < 0;

              return (
                <div
                  className="budgetCard"
                  key={budget.id}
                >
                  <div className="budgetHeader">
                    <div>
                      <h3>{budget.category}</h3>
                      <span>
                        Monthly budget
                      </span>
                    </div>

                    <button
                      className="dangerButton smallButton"
                      onClick={() =>
                        deleteBudget(budget.id)
                      }
                    >
                      Delete
                    </button>
                  </div>

                  <div className="budgetAmounts">
                    <strong>
                      {currency(spent)}
                    </strong>

                    <span>
                      of {currency(budget.limit)}
                    </span>
                  </div>

                  <div className="progress">
                    <div
                      className={
                        exceeded
                          ? "progressFill danger"
                          : "progressFill"
                      }
                      style={{
                        width: `${displayPercentage}%`,
                      }}
                    />
                  </div>

                  <div className="budgetFooter">
                    <span>
                      {percentage}% used
                    </span>

                    <strong
                      className={
                        exceeded
                          ? "negative"
                          : "positive"
                      }
                    >
                      {exceeded
                        ? `Over by ${currency(
                            Math.abs(remaining)
                          )}`
                        : `${currency(
                            remaining
                          )} remaining`}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
