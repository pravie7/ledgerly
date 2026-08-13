import { useEffect, useMemo, useState } from "react";

const categories = [
  "Groceries",
  "Shopping",
  "Dining",
  "Transport",
  "Utilities",
  "Health",
  "Entertainment",
  "Salary",
  "Other",
];

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function Budgets({
  transactions,
  budgets,
  setBudgets,
}) {
  const transactionList = Array.isArray(transactions)
    ? transactions
    : [];

  const budgetList = Array.isArray(budgets)
    ? budgets
    : [];

  const [category, setCategory] = useState("Groceries");
  const [limit, setLimit] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!Array.isArray(budgets)) {
      setBudgets([]);
    }
  }, [budgets, setBudgets]);

  const spendingByCategory = useMemo(() => {
    const map = {};

    transactionList
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .forEach((transaction) => {
        const transactionCategory =
          transaction.category || "Other";

        map[transactionCategory] =
          (map[transactionCategory] || 0) +
          Number(transaction.amount || 0);
      });

    return map;
  }, [transactionList]);

  const totalBudget = useMemo(() => {
    return budgetList.reduce(
      (total, budget) =>
        total + Number(budget.limit || 0),
      0
    );
  }, [budgetList]);

  const totalSpent = useMemo(() => {
    return budgetList.reduce(
      (total, budget) =>
        total +
        Number(
          spendingByCategory[budget.category] || 0
        ),
      0
    );
  }, [budgetList, spendingByCategory]);

  const totalRemaining = totalBudget - totalSpent;

  function resetForm() {
    setCategory("Groceries");
    setLimit("");
    setEditingId(null);
  }

  function saveBudget() {
    const numericLimit = Number(limit);

    if (!limit || numericLimit <= 0) {
      alert("Please enter a valid budget limit.");
      return;
    }

    const duplicate = budgetList.find(
      (budget) =>
        budget.category === category &&
        budget.id !== editingId
    );

    if (duplicate) {
      alert(
        "A budget for this category already exists."
      );
      return;
    }

    if (editingId) {
      setBudgets(
        budgetList.map((budget) =>
          budget.id === editingId
            ? {
                ...budget,
                category,
                limit: numericLimit,
              }
            : budget
        )
      );
    } else {
      setBudgets([
        ...budgetList,
        {
          id: crypto.randomUUID(),
          category,
          limit: numericLimit,
        },
      ]);
    }

    resetForm();
  }

  function editBudget(budget) {
    setEditingId(budget.id);
    setCategory(budget.category);
    setLimit(String(budget.limit || ""));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteBudget(id) {
    const confirmed = window.confirm(
      "Delete this budget?"
    );

    if (!confirmed) {
      return;
    }

    setBudgets(
      budgetList.filter((budget) => budget.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Budgets</h1>

          <p>
            Set monthly spending limits and track your
            progress automatically.
          </p>
        </div>
      </section>

      <section className="statGrid">
        <div className="statCard">
          <span className="statLabel">
            Total Budget
          </span>

          <strong className="statValue">
            {formatCurrency(totalBudget)}
          </strong>

          <span className="statHint">
            Across all categories
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Total Spent
          </span>

          <strong className="statValue">
            {formatCurrency(totalSpent)}
          </strong>

          <span className="statHint">
            Based on recorded expenses
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Remaining
          </span>

          <strong
            className={
              totalRemaining >= 0
                ? "statValue positive"
                : "statValue negative"
            }
          >
            {formatCurrency(totalRemaining)}
          </strong>

          <span className="statHint">
            Budget remaining
          </span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>
              {editingId
                ? "Edit Budget"
                : "Create Monthly Budget"}
            </h2>

            <p>
              Create one budget for each spending
              category.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formField">
            <label>Category</label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="formField">
            <label>Monthly Limit</label>

            <input
              type="number"
              min="0"
              step="100"
              placeholder="Enter monthly limit"
              value={limit}
              onChange={(event) =>
                setLimit(event.target.value)
              }
            />
          </div>
        </div>

        <div className="formActions">
          <button onClick={saveBudget}>
            {editingId
              ? "Save Changes"
              : "Create Budget"}
          </button>

          {editingId && (
            <button
              className="secondaryButton"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Budget Overview</h2>

            <p>
              Spending is calculated automatically from
              your transactions.
            </p>
          </div>
        </div>

        {budgetList.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">▣</div>

            <h3>No budgets yet</h3>

            <p>
              Create your first monthly budget above.
            </p>
          </div>
        ) : (
          <div className="budgetGrid">
            {budgetList.map((budget) => {
              const spent =
                spendingByCategory[
                  budget.category
                ] || 0;

              const budgetLimit =
                Number(budget.limit || 0);

              const percentage =
                budgetLimit > 0
                  ? (spent / budgetLimit) * 100
                  : 0;

              const progress = Math.min(
                100,
                Math.max(0, percentage)
              );

              const remaining =
                budgetLimit - spent;

              const exceeded =
                spent > budgetLimit;

              const warning =
                !exceeded && percentage >= 80;

              return (
                <div
                  className="budgetCard"
                  key={budget.id}
                >
                  <div className="budgetHeader">
                    <div>
                      <h3>{budget.category}</h3>

                      <p>
                        {formatCurrency(spent)} of{" "}
                        {formatCurrency(budgetLimit)}
                      </p>
                    </div>

                    <div className="tableActions">
                      <button
                        className="secondaryButton"
                        onClick={() =>
                          editBudget(budget)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete"
                        onClick={() =>
                          deleteBudget(budget.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width: `${progress}%`,
                        background: exceeded
                          ? "#DC2626"
                          : warning
                          ? "#D97706"
                          : "#6558D3",
                      }}
                    />
                  </div>

                  <div className="budgetRow">
                    <span>
                      {percentage.toFixed(0)}% used
                    </span>

                    <strong
                      className={
                        exceeded
                          ? "negative"
                          : "positive"
                      }
                    >
                      {exceeded
                        ? `Exceeded by ${formatCurrency(
                            Math.abs(remaining)
                          )}`
                        : `${formatCurrency(
                            remaining
                          )} remaining`}
                    </strong>
                  </div>

                  {warning && !exceeded && (
                    <div className="infoNotice">
                      You have used more than 80% of
                      this budget.
                    </div>
                  )}

                  {exceeded && (
                    <div className="infoNotice">
                      This category has exceeded its
                      monthly budget.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
