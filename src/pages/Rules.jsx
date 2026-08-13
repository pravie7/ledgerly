import { useState } from "react";

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

export default function Rules({
  rules,
  setRules,
  categories,
}) {
  const [name, setName] = useState("");
  const [match, setMatch] = useState("");
  const [category, setCategory] =
    useState("Needs review");

  function addRule(event) {
    event.preventDefault();

    if (!name.trim() || !match.trim()) {
      alert("Enter a rule name and matching text.");
      return;
    }

    setRules([
      ...rules,
      {
        id: createId(),
        name: name.trim(),
        match: match.trim(),
        category,
        enabled: true,
      },
    ]);

    setName("");
    setMatch("");
    setCategory("Needs review");
  }

  function toggleRule(id) {
    setRules(
      rules.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              enabled: !rule.enabled,
            }
          : rule
      )
    );
  }

  function deleteRule(id) {
    setRules(
      rules.filter((rule) => rule.id !== id)
    );
  }

  return (
    <div className="pageStack">
      <form
        className="panel"
        onSubmit={addRule}
      >
        <div className="panelHeader">
          <div>
            <h2>Create Categorization Rule</h2>
            <p>
              Define how matching transactions should be
              categorized.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <label>
            Rule Name
            <input
              placeholder="Amazon shopping"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </label>

          <label>
            Match Text
            <input
              placeholder="amazon"
              value={match}
              onChange={(event) =>
                setMatch(event.target.value)
              }
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <button className="primaryButton">
          + Add Rule
        </button>
      </form>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Your Rules</h2>
            <p>
              Rules are disabled or enabled explicitly.
            </p>
          </div>
        </div>

        {rules.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">◇</div>
            <h3>No rules created</h3>
            <p>
              Add a rule to automate categorization.
            </p>
          </div>
        ) : (
          <div className="listCards">
            {rules.map((rule) => (
              <div className="listCard" key={rule.id}>
                <div>
                  <strong>{rule.name}</strong>

                  <span>
                    Match: "{rule.match}"
                  </span>

                  <span>
                    Category: {rule.category}
                  </span>
                </div>

                <div className="listCardRight">
                  <button
                    className={
                      rule.enabled
                        ? "secondaryButton smallButton"
                        : "mutedButton smallButton"
                    }
                    onClick={() =>
                      toggleRule(rule.id)
                    }
                  >
                    {rule.enabled
                      ? "Enabled"
                      : "Disabled"}
                  </button>

                  <button
                    className="dangerButton smallButton"
                    onClick={() =>
                      deleteRule(rule.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
