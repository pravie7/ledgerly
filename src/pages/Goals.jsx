import { useMemo, useState } from "react";

const goalCategories = [
  "Emergency Fund",
  "Vehicle",
  "Home",
  "Travel",
  "Education",
  "Investment",
  "Wedding",
  "Other",
];

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getInitialGoals() {
  try {
    const saved = localStorage.getItem("ledgerly_goals");

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Goals() {
  const [goals, setGoals] = useState(getInitialGoals);

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [initialAmount, setInitialAmount] =
    useState("");
  const [category, setCategory] = useState(
    "Emergency Fund"
  );
  const [targetDate, setTargetDate] = useState("");

  const [contributionGoalId, setContributionGoalId] =
    useState(null);
  const [contributionAmount, setContributionAmount] =
    useState("");

  function saveGoals(items) {
    setGoals(items);

    localStorage.setItem(
      "ledgerly_goals",
      JSON.stringify(items)
    );
  }

  function addGoal() {
    const cleanName = name.trim();
    const numericTarget = Number(target);
    const numericInitialAmount = Number(
      initialAmount || 0
    );

    if (!cleanName) {
      alert("Please enter a goal name.");
      return;
    }

    if (!target || numericTarget <= 0) {
      alert("Please enter a valid target amount.");
      return;
    }

    if (numericInitialAmount < 0) {
      alert("Initial amount cannot be negative.");
      return;
    }

    if (numericInitialAmount > numericTarget) {
      alert(
        "Initial amount cannot be greater than the target."
      );
      return;
    }

    const duplicate = goals.some(
      (goal) =>
        goal.name.toLowerCase() ===
        cleanName.toLowerCase()
    );

    if (duplicate) {
      alert("A goal with this name already exists.");
      return;
    }

    const newGoal = {
      id:
        typeof crypto !== "undefined" &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      name: cleanName,
      target: numericTarget,
      saved: numericInitialAmount,
      category,
      targetDate,
      createdAt: new Date().toISOString(),
    };

    saveGoals([newGoal, ...goals]);

    setName("");
    setTarget("");
    setInitialAmount("");
    setCategory("Emergency Fund");
    setTargetDate("");
  }

  function addContribution(goalId) {
    const amount = Number(contributionAmount);

    if (!contributionAmount || amount <= 0) {
      alert("Please enter a valid contribution.");
      return;
    }

    const updated = goals.map((goal) => {
      if (goal.id !== goalId) {
        return goal;
      }

      return {
        ...goal,
        saved: Math.min(
          Number(goal.target),
          Number(goal.saved || 0) + amount
        ),
      };
    });

    saveGoals(updated);

    setContributionGoalId(null);
    setContributionAmount("");
  }

  function deleteGoal(id) {
    const confirmed = window.confirm(
      "Delete this savings goal?"
    );

    if (!confirmed) {
      return;
    }

    saveGoals(
      goals.filter((goal) => goal.id !== id)
    );
  }

  const totalTarget = useMemo(() => {
    return goals.reduce(
      (total, goal) => total + Number(goal.target || 0),
      0
    );
  }, [goals]);

  const totalSaved = useMemo(() => {
    return goals.reduce(
      (total, goal) => total + Number(goal.saved || 0),
      0
    );
  }, [goals]);

  const totalRemaining = Math.max(
    0,
    totalTarget - totalSaved
  );

  const overallProgress =
    totalTarget > 0
      ? Math.min(
          100,
          (totalSaved / totalTarget) * 100
        )
      : 0;

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Goals</h1>

          <p>
            Set savings targets and track your progress
            toward them.
          </p>
        </div>
      </section>

      <section className="statGrid">
        <div className="statCard">
          <span className="statLabel">
            Active Goals
          </span>

          <strong className="statValue">
            {goals.length}
          </strong>

          <span className="statHint">
            Savings goals created
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Total Target
          </span>

          <strong className="statValue">
            {formatCurrency(totalTarget)}
          </strong>

          <span className="statHint">
            Combined goal amount
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Total Saved
          </span>

          <strong className="statValue positive">
            {formatCurrency(totalSaved)}
          </strong>

          <span className="statHint">
            Current contributions
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Remaining
          </span>

          <strong className="statValue">
            {formatCurrency(totalRemaining)}
          </strong>

          <span className="statHint">
            Across all goals
          </span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Create Savings Goal</h2>

            <p>
              Define what you're saving for and how much you
              need.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formGroup">
            <label>Goal Name</label>

            <input
              type="text"
              placeholder="Emergency Fund, Bike, House..."
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div className="formGroup">
            <label>Target Amount</label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Target amount"
              value={target}
              onChange={(event) =>
                setTarget(event.target.value)
              }
            />
          </div>

          <div className="formGroup">
            <label>Already Saved</label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={initialAmount}
              onChange={(event) =>
                setInitialAmount(event.target.value)
              }
            />
          </div>

          <div className="formGroup">
            <label>Category</label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {goalCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label>Target Date</label>

            <input
              type="date"
              value={targetDate}
              onChange={(event) =>
                setTargetDate(event.target.value)
              }
            />
          </div>
        </div>

        <button onClick={addGoal}>
          + Create Goal
        </button>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Goal Overview</h2>

            <p>
              Track how close you are to reaching each goal.
            </p>
          </div>
        </div>

        {goals.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">◎</div>

            <h3>No savings goals yet</h3>

            <p>
              Create your first goal above to start tracking
              your savings.
            </p>
          </div>
        ) : (
          <>
            <div className="budgetCard">
              <div className="budgetHeader">
                <div>
                  <strong>Overall Progress</strong>

                  <div className="budgetRow">
                    <span>
                      {formatCurrency(totalSaved)}
                    </span>

                    <span>
                      {formatCurrency(totalTarget)}
                    </span>
                  </div>
                </div>

                <strong>
                  {Math.round(overallProgress)}%
                </strong>
              </div>

              <div className="progress">
                <div
                  style={{
                    width: `${overallProgress}%`,
                    background: "#6558D3",
                  }}
                />
              </div>
            </div>

            {goals.map((goal) => {
              const saved = Number(goal.saved || 0);
              const goalTarget = Number(
                goal.target || 0
              );

              const remaining = Math.max(
                0,
                goalTarget - saved
              );

              const progress =
                goalTarget > 0
                  ? Math.min(
                      100,
                      (saved / goalTarget) * 100
                    )
                  : 0;

              const completed =
                saved >= goalTarget;

              return (
                <div
                  className="budgetCard"
                  key={goal.id}
                >
                  <div className="budgetHeader">
                    <div>
                      <h3>{goal.name}</h3>

                      <span>
                        {goal.category}
                        {goal.targetDate
                          ? ` · Target: ${goal.targetDate}`
                          : ""}
                      </span>
                    </div>

                    <button
                      className="delete"
                      onClick={() =>
                        deleteGoal(goal.id)
                      }
                    >
                      Delete
                    </button>
                  </div>

                  <div className="budgetRow">
                    <span>Saved</span>

                    <strong>
                      {formatCurrency(saved)} /{" "}
                      {formatCurrency(goalTarget)}
                    </strong>
                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width: `${progress}%`,
                        background: completed
                          ? "#16A34A"
                          : "#6558D3",
                      }}
                    />
                  </div>

                  <div className="budgetRow">
                    <span>
                      {completed
                        ? "Goal completed"
                        : `${Math.round(progress)}% complete`}
                    </span>

                    <strong
                      className={
                        completed
                          ? "positive"
                          : ""
                      }
                    >
                      {completed
                        ? "₹0 remaining"
                        : `${formatCurrency(
                            remaining
                          )} remaining`}
                    </strong>
                  </div>

                  {contributionGoalId === goal.id ? (
                    <div className="row">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Contribution amount"
                        value={contributionAmount}
                        onChange={(event) =>
                          setContributionAmount(
                            event.target.value
                          )
                        }
                      />

                      <button
                        onClick={() =>
                          addContribution(goal.id)
                        }
                      >
                        Add
                      </button>

                      <button
                        className="secondaryButton"
                        onClick={() => {
                          setContributionGoalId(null);
                          setContributionAmount("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setContributionGoalId(goal.id)
                      }
                      disabled={completed}
                    >
                      {completed
                        ? "Goal Completed"
                        : "+ Add Contribution"}
                    </button>
                  )}
                </div>
              );
            })}
          </>
        )}
      </section>
    </div>
  );
}
