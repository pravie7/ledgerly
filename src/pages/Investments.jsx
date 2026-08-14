import { useMemo } from "react";

export default function Investments({
  investments,
  setInvestments,
}) {
  const assets = investments.assets || [];
  const liabilities = investments.liabilities || [];

  const totalAssets = useMemo(
    () =>
      assets.reduce((sum, item) => sum + Number(item.value || 0), 0),
    [assets]
  );

  const totalLiabilities = useMemo(
    () =>
      liabilities.reduce((sum, item) => sum + Number(item.value || 0), 0),
    [liabilities]
  );

  const netWorth = totalAssets - totalLiabilities;

  function updateAsset(index, value) {
    const updated = [...assets];
    updated[index].value = Number(value);
    setInvestments({
      ...investments,
      assets: updated,
    });
  }

  function updateLiability(index, value) {
    const updated = [...liabilities];
    updated[index].value = Number(value);
    setInvestments({
      ...investments,
      liabilities: updated,
    });
  }

  function addAsset() {
    setInvestments({
      ...investments,
      assets: [
        ...assets,
        {
          name: "New Asset",
          value: 0,
        },
      ],
    });
  }

  function addLiability() {
    setInvestments({
      ...investments,
      liabilities: [
        ...liabilities,
        {
          name: "New Liability",
          value: 0,
        },
      ],
    });
  }

  function renameAsset(index, name) {
    const updated = [...assets];
    updated[index].name = name;
    setInvestments({
      ...investments,
      assets: updated,
    });
  }

  function renameLiability(index, name) {
    const updated = [...liabilities];
    updated[index].name = name;
    setInvestments({
      ...investments,
      liabilities: updated,
    });
  }

  function deleteAsset(index) {
    const updated = assets.filter((_, i) => i !== index);
    setInvestments({
      ...investments,
      assets: updated,
    });
  }

  function deleteLiability(index) {
    const updated = liabilities.filter((_, i) => i !== index);
    setInvestments({
      ...investments,
      liabilities: updated,
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
          <small>Total Liabilities</small>
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
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="budgetRow" style={{ marginBottom: 18 }}>
            <h2>Assets</h2>

            <button onClick={addAsset}>+ Add</button>
          </div>

          {assets.map((asset, index) => (
            <div key={index} style={{ marginBottom: 16 }}>
              <input
                value={asset.name}
                onChange={(e) => renameAsset(index, e.target.value)}
                style={{ marginBottom: 8 }}
              />

              <div className="row">
                <input
                  type="number"
                  value={asset.value}
                  onChange={(e) => updateAsset(index, e.target.value)}
                />

                <button
                  className="delete"
                  onClick={() => deleteAsset(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="budgetRow" style={{ marginBottom: 18 }}>
            <h2>Liabilities</h2>

            <button onClick={addLiability}>+ Add</button>
          </div>

          {liabilities.map((loan, index) => (
            <div key={index} style={{ marginBottom: 16 }}>
              <input
                value={loan.name}
                onChange={(e) => renameLiability(index, e.target.value)}
                style={{ marginBottom: 8 }}
              />

              <div className="row">
                <input
                  type="number"
                  value={loan.value}
                  onChange={(e) => updateLiability(index, e.target.value)}
                />

                <button
                  className="delete"
                  onClick={() => deleteLiability(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Net Worth Summary</h2>

        <table>
          <tbody>
            <tr>
              <td>Total Assets</td>
              <td>₹{totalAssets.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total Liabilities</td>
              <td>₹{totalLiabilities.toLocaleString()}</td>
            </tr>
            <tr>
              <th>Net Worth</th>
              <th>₹{netWorth.toLocaleString()}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
