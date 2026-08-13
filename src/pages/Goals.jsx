import { useEffect, useMemo, useState } from "react";

const goalTypes = [
  "Emergency Fund",
  "Bike",
  "Car",
  "House",
  "Travel",
  "Education",
  "Investment",
  "Other",
];

export default function Goals() {
  const [goals, setGoals] = useState(() => {
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
  });

  const [name, setName] = useState("");
  const [type, setType] = useState("Emergency Fund");
  const [target, setTarget] = useState("");
  const [initialAmount, setInitialAmount] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [contributionId, setContributionId] = useState(null);
  const [contributionAmount, setContributionAmount] = useState("");

  useEffect(() => {
    localStorage.setItem("ledgerly_goals", JSON.stringify(goals));
  }, [goals]);

  const totalTarget = useMemo(() => {
    return goals.reduce((total, goal) => {
      return total + Number(goal.target || 0);
    }, 0);
  }, [goals]);

  const totalSaved = useMemo(() => {
    return goals.reduce((total, goal) => {
      return total + Number(goal.saved || 0);
    }, 0);
  }, [goals]);

  function resetForm() {
    setName("");
    setType("Emergency Fund");
    setTarget("");
    setInitialAmount("");
    setEditingId(null);
  }

  function saveGoal() {
    const cleanName = name.trim();
    const targetAmount = Number(target);
    const savedAmount = Number(initialAmount || 0);

    if (!cleanName) {
      alert("Please enter a goal name.");
      return;
    }

    if (!targetAmount || targetAmount <= 0) {
      alert("Please enter a valid target amount.");
      return;
    }

    if (savedAmount < 0) {
      alert("Saved amount cannot be negative.");
      return;
    }

    if (savedAmount > targetAmount) {
      alert("Saved amount cannot be greater than the target.");
      return;
    }

    if (editingId) {
      setGoals((currentGoals) =>
        currentGoals.map((goal) => {
          if (goal.id !== editingId) {
            return goal;
          }

          return {
            ...goal,
            name: cleanName,
            type,
            target: targetAmount,
            saved: savedAmount,
          };
        })
      );
    } else {
      const duplicate = goals.some(
        (goal) =>
          goal.name.trim().toLowerCase() === cleanName.toLowerCase()
      );

      if (duplicate) {
        alert("A goal with this name already exists.");
        return;
      }

      const newGoal = {
        id: crypto.randomUUID(),
        name: cleanName,
        type,
        target: targetAmount,
        saved: savedAmount,
        createdAt: new Date().toISOString(),
      };

      setGoals((currentGoals) => [newGoal, ...currentGoals]);
    }

    resetForm();
  }

  function editGoal(goal) {
    setEditingId(goal.id);
    setName(goal.name);
    setType(goal.type || "Other");
    setTarget(String(goal.target || ""));
    setInitialAmount(String(goal.saved || ""));
    setContributionId(null);
    setContributionAmount("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteGoal(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?"
    );

    if (!confirmed) {
      return;
    }

    setGoals((currentGoals) =>
      currentGoals.filter((goal) => goal.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }

    if (contributionId === id) {
      setContributionId(null);
      setContributionAmount("");
    }
  }

  function addContribution(goalId) {
    const amount = Number(contributionAmount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid contribution.");
      return;
    }

    setGoals((currentGoals) =>
      currentGoals.map((goal) => {
        if (goal.id !== goalId) {
          return goal;
        }

        const currentSaved = Number(goal.saved || 0);
        const targetAmount = Number(goal.target || 0);

        const newSaved = Math.min(
          currentSaved + amount,
          targetAmount
        );

        return {
          ...goal,
          saved: newSaved,
        };
      })
    );

    setContributionId(null);
    setContributionAmount("");
  }

  function cancelContribution() {
    setContributionId(null);
    setContributionAmount("");
  }

  function getProgress(goal) {
    const targetAmount = Number(goal.target || 0);
    const savedAmount = Number(goal.saved || 0);

    if (targetAmount <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((savedAmount / targetAmount) * 100)
    );
  }

  function getRemaining(goal) {
    const targetAmount = Number(goal.target || 0);
    const savedAmount = Number(goal.saved || 0);

    return Math.max(0, targetAmount - savedAmount);
  }

  return (
    <>
      <div className="panel">
        <h2>{editingId ? "Edit Goal" : "Create Savings Goal"}</h2>

        <input
          type="text"
          placeholder="Goal name (Emergency Fund, Bike...)"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <div className="row">
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {goalTypes.map((goalType) => (
              <option key={goalType} value={goalType}>
                {goalType}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            placeholder="Target amount"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
          />
        </div>

        <input
          type="number"
          min="0"
          placeholder="Already saved (optional)"
          value={initialAmount}
          onChange={(event) =>
            setInitialAmount(event.target.value)
          }
        />

        <div className="goalFormActions">
          <button onClick={saveGoal}>
            {editingId ? "Update Goal" : "Create Goal"}
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
      </div>

      <div className="panel">
        <h2>Goals Summary</h2>

        <div className="goalSummary">
          <div className="goalSummaryCard">
            <span>Total Goals</span>
            <strong>{goals.length}</strong>
          </div>

          <div className="goalSummaryCard">
            <span>Total Target</span>
            <strong>
              ₹{totalTarget.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="goalSummaryCard">
            <span>Total Saved</span>
            <strong>
              ₹{totalSaved.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="goalSummaryCard">
            <span>Overall Progress</span>
            <strong>
              {totalTarget > 0
                ? Math.min(
                    100,
                    Math.round(
                      (totalSaved / totalTarget) * 100
                    )
                  )
                : 0}
              %
            </strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Your Goals</h2>

        {goals.length === 0 ? (
          <div className="emptyGoals">
            <h3>No savings goals yet</h3>
            <p>
              Create your first goal above and start tracking
              your progress.
            </p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = getProgress(goal);
            const remaining = getRemaining(goal);
            const completed = progress >= 100;

            return (
              <div className="goalCard" key={goal.id}>
                <div className="goalHeader">
                  <div>
                    <h3>{goal.name}</h3>

                    <span className="goalType">
                      {goal.type}
                    </span>
                  </div>

                  <div className="goalActions">
                    <button
                      className="editButton"
                      onClick={() => editGoal(goal)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="goalAmounts">
                  <div>
                    <span>Saved</span>

                    <strong>
                      ₹{Number(goal.saved || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>Target</span>

                    <strong>
                      ₹{Number(goal.target || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>Remaining</span>

                    <strong>
                      ₹{remaining.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="goalProgressHeader">
                  <span>Progress</span>

                  <strong>{progress}%</strong>
                </div>

                <div className="goalProgress">
                  <div
                    className="goalProgressBar"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="goalStatus">
                  {completed ? (
                    <span className="goalCompleted">
                      🎉 Goal completed
                    </span>
                  ) : (
                    <span>
                      ₹{remaining.toLocaleString("en-IN")} left
                      to reach your goal
                    </span>
                  )}
                </div>

                {contributionId === goal.id ? (
                  <div className="contributionBox">
                    <input
                      type="number"
                      min="0"
                      placeholder="Contribution amount"
                      value={contributionAmount}
                      onChange={(event) =>
                        setContributionAmount(event.target.value)
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
                      onClick={cancelContribution}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="contributeButton"
                    onClick={() => {
                      setContributionId(goal.id);
                      setContributionAmount("");
                    }}
                    disabled={completed}
                  >
                    {completed
                      ? "Goal Completed"
                      : "+ Add Contribution"}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .goalFormActions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .secondaryButton {
          background: #E5E7EB;
          color: #111827;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
        }

        .secondaryButton:hover {
          opacity: 0.9;
        }

        .goalSummary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .goalSummaryCard {
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 16px;
        }

        .goalSummaryCard span {
          display: block;
          font-size: 13px;
          color: #6B7280;
          margin-bottom: 6px;
        }

        .goalSummaryCard strong {
          font-size: 20px;
        }

        .goalCard {
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 16px;
        }

        .goalHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .goalHeader h3 {
          margin: 0 0 6px;
        }

        .goalType {
          display: inline-block;
          background: #F3F4F6;
          color: #6B7280;
          padding: 4px 9px;
          border-radius: 999px;
          font-size: 12px;
        }

        .goalActions {
          display: flex;
          gap: 8px;
        }

        .editButton {
          background: #E5E7EB;
          color: #111827;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
        }

        .goalAmounts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 20px 0 14px;
        }

        .goalAmounts div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .goalAmounts span {
          color: #6B7280;
          font-size: 13px;
        }

        .goalAmounts strong {
          font-size: 16px;
        }

        .goalProgressHeader {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
        }

        .goalProgress {
          width: 100%;
          height: 11px;
          background: #E5E7EB;
          border-radius: 999px;
          overflow: hidden;
        }

        .goalProgressBar {
          height: 100%;
          background: #6558D3;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .goalStatus {
          margin-top: 10px;
          font-size: 14px;
          color: #6B7280;
        }

        .goalCompleted {
          color: #16A34A;
          font-weight: bold;
        }

        .contributeButton {
          margin-top: 14px;
          width: 100%;
        }

        .contributionBox {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .contributionBox input {
          flex: 1;
        }

        .emptyGoals {
          text-align: center;
          padding: 30px 10px;
          color: #6B7280;
        }

        .emptyGoals h3 {
          color: #111827;
          margin-bottom: 6px;
        }

        @media (max-width: 768px) {
          .goalSummary {
            grid-template-columns: repeat(2, 1fr);
          }

          .goalAmounts {
            grid-template-columns: 1fr;
          }

          .goalHeader {
            flex-direction: column;
          }

          .goalActions {
            width: 100%;
          }

          .goalActions button {
            flex: 1;
          }

          .contributionBox {
            flex-wrap: wrap;
          }

          .contributionBox input {
            width: 100%;
            flex-basis: 100%;
          }
        }

        @media (max-width: 480px) {
          .goalSummary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
