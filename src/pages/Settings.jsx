import { useState } from "react";

export default function Settings({
  assets,
  liabilities,
  netWorthConfigured,
  categories,
  accounts,
  tags,
  setSettings,
  resetAllData,
}) {
  const [newCategory, setNewCategory] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [newTag, setNewTag] = useState("");

  const netWorth = Number(assets) - Number(liabilities);

  function updateAsset(value) {
    setSettings({
      assets: Number(value),
      netWorthConfigured: true,
    });
  }

  function updateLiability(value) {
    setSettings({
      liabilities: Number(value),
      netWorthConfigured: true,
    });
  }

  function addCategory() {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) return;

    setSettings({
      categories: [...categories, newCategory.trim()],
    });

    setNewCategory("");
  }

  function removeCategory(item) {
    setSettings({
      categories: categories.filter((c) => c !== item),
    });
  }

  function addAccount() {
    if (!newAccount.trim()) return;

    if (accounts.find((a) => a.name === newAccount.trim()))
      return;

    setSettings({
      accounts: [
        ...accounts,
        {
          id: crypto.randomUUID(),
          name: newAccount.trim(),
        },
      ],
    });

    setNewAccount("");
  }

  function removeAccount(id) {
    setSettings({
      accounts: accounts.filter((a) => a.id !== id),
    });
  }

  function addTag() {
    if (!newTag.trim()) return;
    if (tags.includes(newTag.trim())) return;

    setSettings({
      tags: [...tags, newTag.trim()],
    });

    setNewTag("");
  }

  function removeTag(tag) {
    setSettings({
      tags: tags.filter((t) => t !== tag),
    });
  }

  function exportBackup() {
    const data = localStorage.getItem("ledgerly_state");

    const blob = new Blob([data], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `ledgerly-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;

    a.click();

    URL.revokeObjectURL(url);
  }

  function importBackup(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        localStorage.setItem(
          "ledgerly_state",
          reader.result
        );
        window.location.reload();
      } catch {
        alert("Invalid backup file");
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Assets</small>
          <h2>₹{Number(assets).toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Liabilities</small>
          <h2>₹{Number(liabilities).toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Net Worth</small>
          <h2
            style={{
              color: netWorth >= 0 ? "#16A34A" : "#DC2626",
            }}
          >
            ₹{netWorth.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Status</small>
          <h2>{netWorthConfigured ? "Ready" : "Setup"}</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Financial Profile</h2>

        <div className="row">
          <div>
            <label>Total Assets</label>

            <input
              type="number"
              value={assets}
              onChange={(e) =>
                updateAsset(e.target.value)
              }
            />
          </div>

          <div>
            <label>Total Liabilities</label>

            <input
              type="number"
              value={liabilities}
              onChange={(e) =>
                updateLiability(e.target.value)
              }
            />
          </div>
        </div>

        <div className="budgetCard">
          <div className="budgetRow">
            <strong>Current Net Worth</strong>

            <span
              style={{
                color:
                  netWorth >= 0 ? "#16A34A" : "#DC2626",
                fontWeight: "bold",
              }}
            >
              ₹{netWorth.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Accounts</h2>

          <div className="row">
            <input
              placeholder="HDFC Savings"
              value={newAccount}
              onChange={(e) =>
                setNewAccount(e.target.value)
              }
            />

            <button onClick={addAccount}>Add</button>
          </div>

          {accounts.length === 0 ? (
            <p>No accounts added.</p>
          ) : (
            accounts.map((acc) => (
              <div className="budgetRow" key={acc.id}>
                <span>{acc.name}</span>

                <button
                  className="delete"
                  onClick={() =>
                    removeAccount(acc.id)
                  }
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <h2>Categories</h2>

          <div className="row">
            <input
              placeholder="Education"
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value)
              }
            />

            <button onClick={addCategory}>Add</button>
          </div>

          {categories.map((cat) => (
            <div className="budgetRow" key={cat}>
              <span>{cat}</span>

              <button
                className="delete"
                onClick={() => removeCategory(cat)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Tags</h2>

        <div className="row">
          <input
            placeholder="Family"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />

          <button onClick={addTag}>Add Tag</button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 16,
          }}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="badge"
              style={{ cursor: "pointer" }}
              onClick={() => removeTag(tag)}
            >
              {tag} ✕
            </span>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Backup & Restore</h2>

        <div className="row">
          <button onClick={exportBackup}>
            Export Backup
          </button>

          <label className="secondary" style={{ padding: 12 }}>
            Import Backup
            <input
              type="file"
              accept=".json"
              hidden
              onChange={importBackup}
            />
          </label>
        </div>

        <p
          style={{
            color: "#6B7280",
            marginTop: 12,
          }}
        >
          Backup contains transactions, budgets, goals,
          recurring payments, subscriptions, rules,
          documents metadata, accounts, categories and
          settings.
        </p>
      </div>

      <div
        className="panel"
        style={{ border: "1px solid #FCA5A5" }}
      >
        <h2 style={{ color: "#DC2626" }}>
          Danger Zone
        </h2>

        <p
          style={{
            color: "#6B7280",
            marginBottom: 16,
          }}
        >
          This permanently deletes all Ledgerly data from
          this browser.
        </p>

        <button
          className="delete"
          onClick={resetAllData}
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
}
