import { useState } from "react";

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

function currency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function Goals({ goals, setGoals }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");

  function addGoal(event) {
    event.preventDefault();

    const cleanName = name.trim();
    const targetAmount = Number(target);
    const savedAmount = Number(saved || 0);

    if (!cleanName) {
      alert("Enter a goal name.");
      return;
    }

    if (
      !Number.isFinite(targetAmount) ||
      targetAmount <= 0
    ) {
      alert("Enter a valid target amount.");
      return;
    }

    if (
      !Number.isFinite(savedAmount) ||
      savedAmount < 0
    ) {
      alert("Enter a valid saved amount.");
      return;
    }

    setGoals([
      ...goals,
      {
        id: createId(),
        name: cleanName,
        target: targetAmount,
        saved: savedAmount,
        dueDate,
        note: note.trim(),
      },
    ]);

    setName("");
    setTarget("");
    setSaved("");
    setDueDate("");
    setNote("");
  }

  function updateGoal(id) {
    const goal = goals.find((item) => item.id === id);

    if (!goal) return;

    const value = window.prompt(
      "Enter the new saved amount:",
      goal.saved
    );

    if (value === null) return;

    const newSaved = Number(value);

    if (!Number.isFinite(newSaved) || newSaved < 0) {
      alert("Invalid amount.");
      return;
    }

    setGoals(
      goals.map((item) =>
        item.id === id
          ? { ...item, saved: newSaved }
          : item
      )
    );
  }

  function deleteGoal(id) {
    if (!window.confirm("Delete this goal?")) {
      return;
    }

    setGoals(
      goals.filter((goal) => goal.id !== id)
    );
  }

  return (
    <div className="pageStack">
      <form
        className="panel"
        onSubmit={addGoal}
      >
        <div className="panelHeader">
          <div>
            <h2>Create Savings Goal</h2>
            <p>
              Track progress toward something that
              matters to you.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <label>
            Goal Name
            <input
              placeholder="Emergency Fund, Bike..."
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </label>

          <label>
            Target Amount
            <input
              type="number"
              min="1"
              placeholder="₹0"
              value={target}
              onChange={(event) =>
                setTarget(event.target.value)
              }
            />
          </label>

          <label>
            Already Saved
            <input
              type="number"
              min="0"
              placeholder="₹0"
              value={saved}
              onChange={(event) =>
                setSaved(event.target.value)
              }
            />
          </label>

          <label>
            Due Date
            <input
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
            />
          </label>

          <label className="fullWidth">
            Note
            <textarea
              placeholder="Optional note..."
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
            />
          </label>
        </div>

        <button className="primaryButton" type="submit">
          + Create Goal
        </button>
      </form>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Your Goals</h2>
            <p>
              Monitor progress toward each target.
            </p>
          </div>
        </div>

        {goals.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">◎</div>
            <h3>No savings goals</h3>
            <p>
              Create your first goal to start tracking
              progress.
            </p>
          </div>
        ) : (
          <div className="goalGrid">
            {goals.map((goal) => {
              const percentage =
                goal.target > 0
                  ? Math.round(
                      (goal.saved / goal.target) * 100
                    )
                  : 0;

              const displayPercentage = Math.min(
                percentage,
                100
              );

              const remaining = Math.max(
                goal.target - goal.saved,
                0
              );

              return (
                <div
                  className="goalCard"
                  key={goal.id}
                >
                  <div className="goalHeader">
                    <div>
                      <h3>{goal.name}</h3>

                      {goal.dueDate && (
                        <span>
                          Due {goal.dueDate}
                        </span>
                      )}
                    </div>

                    <div className="goalActions">
                      <button
                        className="secondaryButton smallButton"
                        onClick={() =>
                          updateGoal(goal.id)
                        }
                      >
                        Add / Edit
                      </button>

                      <button
                        className="dangerButton smallButton"
                        onClick={() =>
                          deleteGoal(goal.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="goalAmounts">
                    <strong>
                      {currency(goal.saved)}
                    </strong>

                    <span>
                      of {currency(goal.target)}
                    </span>
                  </div>

                  <div className="progress">
                    <div
                      className="progressFill"
                      style={{
                        width: `${displayPercentage}%`,
                      }}
                    />
                  </div>

                  <div className="goalFooter">
                    <strong>
                      {percentage}% complete
                    </strong>

                    <span>
                      {currency(remaining)} remaining
                    </span>
                  </div>

                  {goal.note && (
                    <p className="goalNote">
                      {goal.note}
                    </p>
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
