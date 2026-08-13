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
  const [assetInput, setAssetInput] =
    useState(assets || "");

  const [liabilityInput, setLiabilityInput] =
    useState(liabilities || "");

  const [accountInput, setAccountInput] =
    useState("");

  const [categoryInput, setCategoryInput] =
    useState("");

  const [tagInput, setTagInput] =
    useState("");

  function saveFinancialProfile(event) {
    event.preventDefault();

    const newAssets = Number(assetInput || 0);
    const newLiabilities =
      Number(liabilityInput || 0);

    if (
      !Number.isFinite(newAssets) ||
      newAssets < 0 ||
      !Number.isFinite(newLiabilities) ||
      newLiabilities < 0
    ) {
      alert("Enter valid financial values.");
      return;
    }

    setSettings({
      assets: newAssets,
      liabilities: newLiabilities,
      netWorthConfigured: true,
    });

    alert("Financial profile saved.");
  }

  function addAccount(event) {
    event.preventDefault();

    const value = accountInput.trim();

    if (!value) return;

    if (
      accounts.some(
        (item) =>
          item.toLowerCase() === value.toLowerCase()
      )
    ) {
      alert("Account already exists.");
      return;
    }

    setSettings({
      accounts: [...accounts, value],
    });

    setAccountInput("");
  }

  function removeAccount(account) {
    setSettings({
      accounts: accounts.filter(
        (item) => item !== account
      ),
    });
  }

  function addCategory(event) {
    event.preventDefault();

    const value = categoryInput.trim();

    if (!value) return;

    if (
      categories.some(
        (item) =>
          item.toLowerCase() === value.toLowerCase()
      )
    ) {
      alert("Category already exists.");
      return;
    }

    setSettings({
      categories: [...categories, value],
    });

    setCategoryInput("");
  }

  function removeCategory(category) {
    setSettings({
      categories: categories.filter(
        (item) => item !== category
      ),
    });
  }

  function addTag(event) {
    event.preventDefault();

    const value = tagInput.trim();

    if (!value) return;

    if (
      tags.some(
        (item) =>
          item.toLowerCase() === value.toLowerCase()
      )
    ) {
      alert("Tag already exists.");
      return;
    }

    setSettings({
      tags: [...tags, value],
    });

    setTagInput("");
  }

  function removeTag(tag) {
    setSettings({
      tags: tags.filter((item) => item !== tag),
    });
  }

  const netWorth =
    Number(assets || 0) -
    Number(liabilities || 0);

  return (
    <div className="pageStack">
      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Financial Profile</h2>
            <p>
              Set your actual asset and liability totals.
            </p>
          </div>
        </div>

        <form onSubmit={saveFinancialProfile}>
          <div className="formGrid">
            <label>
              Total Assets
              <input
                type="number"
                min="0"
                value={assetInput}
                placeholder="0"
                onChange={(event) =>
                  setAssetInput(event.target.value)
                }
              />
            </label>

            <label>
              Total Liabilities
              <input
                type="number"
                min="0"
                value={liabilityInput}
                placeholder="0"
                onChange={(event) =>
                  setLiabilityInput(
                    event.target.value
                  )
                }
              />
            </label>
          </div>

          <div className="netWorthBox">
            <span>Net Worth</span>

            <strong>
              {netWorthConfigured
                ? `₹${netWorth.toLocaleString(
                    "en-IN"
                  )}`
                : "Not set"}
            </strong>
          </div>

          <button
            className="primaryButton"
            type="submit"
          >
            Save Financial Profile
          </button>
        </form>
      </section>

      <section className="settingsGrid">
        <div className="panel">
          <h2>Accounts</h2>

          <form
            className="inlineForm"
            onSubmit={addAccount}
          >
            <input
              placeholder="Main Checking"
              value={accountInput}
              onChange={(event) =>
                setAccountInput(event.target.value)
              }
            />

            <button className="primaryButton">
              Add
            </button>
          </form>

          <div className="chipList">
            {accounts.length === 0 ? (
              <span className="mutedText">
                No accounts configured.
              </span>
            ) : (
              accounts.map((account) => (
                <span className="chip" key={account}>
                  {account}

                  <button
                    onClick={() =>
                      removeAccount(account)
                    }
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="panel">
          <h2>Categories</h2>

          <form
            className="inlineForm"
            onSubmit={addCategory}
          >
            <input
              placeholder="New category"
              value={categoryInput}
              onChange={(event) =>
                setCategoryInput(
                  event.target.value
                )
              }
            />

            <button className="primaryButton">
              Add
            </button>
          </form>

          <div className="chipList">
            {categories.map((category) => (
              <span className="chip" key={category}>
                {category}

                <button
                  onClick={() =>
                    removeCategory(category)
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Tags</h2>

          <form
            className="inlineForm"
            onSubmit={addTag}
          >
            <input
              placeholder="New tag"
              value={tagInput}
              onChange={(event) =>
                setTagInput(event.target.value)
              }
            />

            <button className="primaryButton">
              Add
            </button>
          </form>

          <div className="chipList">
            {tags.length === 0 ? (
              <span className="mutedText">
                No tags configured.
              </span>
            ) : (
              tags.map((tag) => (
                <span className="chip" key={tag}>
                  {tag}

                  <button
                    onClick={() =>
                      removeTag(tag)
                    }
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="panel dangerPanel">
        <h2>Danger Zone</h2>

        <p>
          This removes all Ledgerly data stored by this
          application.
        </p>

        <button
          className="dangerButton"
          onClick={resetAllData}
        >
          Reset All Data
        </button>
      </section>
    </div>
  );
}
