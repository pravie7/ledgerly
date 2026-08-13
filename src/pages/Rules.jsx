import { useEffect, useMemo, useState } from "react";

const categories = [
  "Shopping",
  "Groceries",
  "Dining",
  "Transport",
  "Utilities",
  "Health",
  "Entertainment",
  "Salary",
  "Other",
];

const STORAGE_KEY = "ledgerly_rules";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function Rules() {
  const [rules, setRules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [ruleName, setRuleName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [type, setType] = useState("expense");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  }, [rules]);

  const activeRules = useMemo(() => {
    return rules.filter((rule) => rule.enabled).length;
  }, [rules]);

  function addRule() {
    const trimmedName = ruleName.trim();
    const trimmedKeyword = keyword.trim();

    if (!trimmedName || !trimmedKeyword) {
      alert("Please enter a rule name and keyword.");
      return;
    }

    const duplicate = rules.some(
      (rule) =>
        rule.keyword.toLowerCase() ===
          trimmedKeyword.toLowerCase() &&
        rule.type === type
    );

    if (duplicate) {
      alert("A rule with this keyword and transaction type already exists.");
      return;
    }

    const newRule = {
      id: createId(),
      name: trimmedName,
      keyword: trimmedKeyword,
      category,
      type,
      enabled,
      createdAt: new Date().toISOString(),
    };

    setRules((currentRules) => [newRule, ...currentRules]);

    setRuleName("");
    setKeyword("");
    setCategory("Shopping");
    setType("expense");
    setEnabled(true);
  }

  function toggleRule(id) {
    setRules((currentRules) =>
      currentRules.map((rule) =>
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
    const confirmed = window.confirm(
      "Delete this rule?"
    );

    if (!confirmed) {
      return;
    }

    setRules((currentRules) =>
      currentRules.filter((rule) => rule.id !== id)
    );
  }

  function clearAllRules() {
    if (rules.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Delete all Ledgerly rules?"
    );

    if (!confirmed) {
      return;
    }

    setRules([]);
  }

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Rules</h1>

          <p>
            Automatically organize transactions using
            merchant and keyword rules.
          </p>
        </div>
      </section>

      <section className="statGrid">
        <div className="statCard">
          <span className="statLabel">
            Total Rules
          </span>

          <strong className="statValue">
            {rules.length}
          </strong>

          <span className="statHint">
            Saved automation rules
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Active Rules
          </span>

          <strong className="statValue positive">
            {activeRules}
          </strong>

          <span className="statHint">
            Currently enabled
          </span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Create Rule</h2>

            <p>
              Define how Ledgerly should categorize matching
              transactions.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formField">
            <label>Rule Name</label>

            <input
              type="text"
              placeholder="Amazon Shopping"
              value={ruleName}
              onChange={(event) =>
                setRuleName(event.target.value)
              }
            />
          </div>

          <div className="formField">
            <label>Merchant / Keyword</label>

            <input
              type="text"
              placeholder="Amazon"
              value={keyword}
              onChange={(event) =>
                setKeyword(event.target.value)
              }
            />
          </div>

          <div className="formField">
            <label>Transaction Type</label>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option value="expense">
                Expense
              </option>

              <option value="income">
                Income
              </option>
            </select>
          </div>

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
        </div>

        <div className="ruleCreateFooter">
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) =>
                setEnabled(event.target.checked)
              }
            />

            <span>Enable rule immediately</span>
          </label>

          <button onClick={addRule}>
            + Create Rule
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Your Rules</h2>

            <p>
              Rules are stored locally on this device.
            </p>
          </div>

          {rules.length > 0 && (
            <button
              className="secondaryButton"
              onClick={clearAllRules}
            >
              Clear All
            </button>
          )}
        </div>

        {rules.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">◇</div>

            <h3>No rules yet</h3>

            <p>
              Create your first rule to automatically
              organize matching transactions.
            </p>
          </div>
        ) : (
          <div className="rulesList">
            {rules.map((rule) => (
              <div
                className="ruleCard"
                key={rule.id}
              >
                <div className="ruleMain">
                  <div className="ruleTitleRow">
                    <strong>{rule.name}</strong>

                    <span
                      className={
                        rule.enabled
                          ? "ruleStatus active"
                          : "ruleStatus inactive"
                      }
                    >
                      {rule.enabled
                        ? "Active"
                        : "Disabled"}
                    </span>
                  </div>

                  <div className="ruleDetails">
                    <span>
                      If merchant contains{" "}
                      <strong>
                        "{rule.keyword}"
                      </strong>
                    </span>

                    <span>→</span>

                    <span>
                      Category:{" "}
                      <strong>
                        {rule.category}
                      </strong>
                    </span>

                    <span>·</span>

                    <span>
                      {rule.type === "income"
                        ? "Income"
                        : "Expense"}
                    </span>
                  </div>
                </div>

                <div className="ruleActions">
                  <button
                    className="secondaryButton"
                    onClick={() =>
                      toggleRule(rule.id)
                    }
                  >
                    {rule.enabled
                      ? "Disable"
                      : "Enable"}
                  </button>

                  <button
                    className="delete"
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
