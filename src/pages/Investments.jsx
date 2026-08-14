import { useMemo } from "react";

export default function Investments({
  investments,
  setInvestments,
}) {
  const assets = investments.assets;
  const liabilities = investments.liabilities;

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
    setInvestments({ ...investments, assets: copy });
  }

  function updateLiability(index, value) {
    const copy = [...liabilities];
    copy[index].value = Number(value);
    setInvestments({
      ...investments,
      liabilities: copy,
    });
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

          {assets.map((item, index) => (
            <div
              key={item.name}
              className="budgetRow"
              style={{ marginBottom: 14 }}
            >
              <span>{item.name}</span>

              <input
                type="number"
                value={item.value}
                onChange={(e) =>
                  updateAsset(index, e.target.value)
                }
                style={{ width: 140 }}
              />
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>Liabilities</h2>

          {liabilities.map((item, index) => (
            <div
              key={item.name}
              className="budgetRow"
              style={{ marginBottom: 14 }}
            >
              <span>{item.name}</span>

              <input
                type="number"
                value={item.value}
                onChange={(e) =>
                  updateLiability(index, e.target.value)
                }
                style={{ width: 140 }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Asset Allocation</h2>

        {assets.map((item) => {
          const pct =
            totalAssets === 0
              ? 0
              : Math.round(
                  (item.value / totalAssets) * 100
                );

          return (
            <div
              key={item.name}
              style={{ marginBottom: 18 }}
            >
              <div className="budgetRow">
                <span>{item.name}</span>
                <strong>{pct}%</strong>
              </div>

              <div className="progress">
                <div style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
