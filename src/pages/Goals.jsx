import { useEffect, useMemo, useState } from "react";

export default function Goals() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("ledgerly_goals");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [savedAmount, setSavedAmount] = useState("");

  useEffect(() => {
    localStorage.setItem("ledgerly_goals", JSON.stringify(goals));
  }, [goals]);

  const totalTarget = useMemo(
    () => goals.reduce((sum, g) => sum + g.target, 0),
    [goals]
  );

  const totalSaved = useMemo(
    () => goals.reduce((sum, g) => sum + g.saved, 0),
    [goals]
  );

  function createGoal() {
    if (!name || !target) return;

    const newGoal = {
      id: crypto.randomUUID(),
      name,
      target: Number(target),
      saved: Number(savedAmount || 0),
    };

    setGoals([newGoal, ...goals]);

    setName("");
    setTarget("");
    setSavedAmount("");
  }

  function addContribution(id, amount) {
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, saved: g.saved + amount } : g
      )
    );
  }

  function deleteGoal(id) {
    setGoals(goals.filter((g) => g.id !== id));
  }

  return (
    <>
      <div className="panel">
        <h2>Create Savings Goal</h2>

        <input
          placeholder="Goal Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="row">
          <input
            type="number"
            placeholder="Target Amount"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />

          <input
            type="number"
            placeholder="Already Saved"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
          />
        </div>

        <button onClick={createGoal}>Create Goal</button>
      </div>

      <div className="panel">
        <h2>Portfolio Summary</h2>

        <div className="cards">
          <div className="card">
            <small>Total Target</small>
            <h2>₹{totalTarget.toLocaleString()}</h2>
          </div>

          <div className="card">
            <small>Total Saved</small>
            <h2 style={{ color: "#16A34A" }}>
              ₹{totalSaved.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Active Goals</h2>

        {goals.length === 0 ? (
          <p>No savings goals created.</p>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onAdd={addContribution}
              onDelete={deleteGoal}
            />
          ))
        )}
      </div>
    </>
  );
}

function GoalCard({ goal, onAdd, onDelete }) {
  const [value, setValue] = useState("");

  const percent = Math.min(
    100,
    Math.round((goal.saved / goal.target) * 100)
  );

  const remaining = Math.max(0, goal.target - goal.saved);

  return (
    <div className="goalCard">
      <div className="goalHeader">
        <div>
          <h3>{goal.name}</h3>
          <small>
            ₹{goal.saved.toLocaleString()} of ₹
            {goal.target.toLocaleString()}
          </small>
        </div>

        <button
          className="delete"
          onClick={() => onDelete(goal.id)}
        >
          Delete
        </button>
      </div>

      <div className="progress">
        <div
          style={{
            width: `${percent}%`,
            background: "#16A34A",
          }}
        />
      </div>

      <div className="goalFooter">
        <strong>{percent}% Complete</strong>
        <span>Remaining ₹{remaining.toLocaleString()}</span>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <input
          type="number"
          placeholder="Add Contribution"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          onClick={() => {
            if (!value) return;
            onAdd(goal.id, Number(value));
            setValue("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
