import { useMemo, useState } from "react";

const defaultAssets = [
  { name: "Bank Balance", value: 0 },
  { name: "EPF", value: 0 },
  { name: "PPF", value: 0 },
  { name: "Mutual Funds", value: 0 },
  { name: "Gold", value: 0 },
  { name: "Land", value: 0 },
  { name: "Car", value: 0 },
];

const defaultLiabilities = [
  { name: "Home Loan", value: 0 },
  { name: "Car Loan", value: 0 },
  { name: "Credit Card", value: 0 },
  { name: "Personal Loan", value: 0 },
];

export default function Investments() {
  const [assets, setAssets] = useState(defaultAssets);
  const [liabilities, setLiabilities] = useState(
    defaultLiabilities
  );

  const totalAssets = useMemo(
    () =>
      assets.reduce((s, a) => s + Number(a.value), 0),
    [assets]
  );

  const totalLiabilities = useMemo(
    () =>
      liabilities.reduce(
        (s, l) => s + Number(l.value),
        0
      ),
    [liabilities]
  );

  const netWorth = totalAssets - totalLiabilities;

  function updateAsset(index, value) {
    const copy = [...assets];
    copy[index].value = Number(value);
    setAssets(copy);
  }

  function updateLiability(index, value) {
    const copy = [...liabilities];
    copy[index].value = Number(value);
    setLiabilities(copy);
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Total Assets</small>
          <h2 style={{ color: "#16A34A" }}>
            ₹{totalAssets.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Liabilities</small>
          <h2 style={{ color: "#DC2626" }}>
            ₹{totalLiabilities.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Net Worth</small>
          <h2 style={{ color: "#2563EB" }}>
            ₹{netWorth.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Debt Ratio</small>
          <h2>
            {totalAssets === 0
              ? 0
              : Math.round(
                  (totalLiabilities / totalAssets) * 100
                )}
            %
          </h2>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Assets</h2>

          {assets.map((a, i) => (
            <div
              className="budgetRow"
              key={a.name}
              style={{ marginBottom: 12 }}
            >
              <span>{a.name}</span>

              <input
                type="number"
                value={a.value}
                onChange={(e) =>
                  updateAsset(i, e.target.value)
                }
                style={{ width: 140 }}
              />
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>Liabilities</h2>

          {liabilities.map((l, i) => (
            <div
              className="budgetRow"
              key={l.name}
              style={{ marginBottom: 12 }}
            >
              <span>{l.name}</span>

              <input
                type="number"
                value={l.value}
                onChange={(e) =>
                  updateLiability(i, e.target.value)
                }
                style={{ width: 140 }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Asset Allocation</h2>

        {assets.map((a) => {
          const percent =
            totalAssets === 0
              ? 0
              : Math.round((a.value / totalAssets) * 100);

          return (
            <div
              key={a.name}
              style={{ marginBottom: 18 }}
            >
              <div className="budgetRow">
                <span>{a.name}</span>
                <strong>{percent}%</strong>
              </div>

              <div className="progress">
                <div
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
