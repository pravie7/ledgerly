export default function Settings({
  assets,
  liabilities,
  setAssets,
  setLiabilities,
}) {
  return (
    <div className="panel">
      <h2>Financial Profile</h2>

      <label>Total Assets</label>
      <input
        type="number"
        value={assets}
        onChange={(e) => setAssets(Number(e.target.value))}
      />

      <label>Total Liabilities</label>
      <input
        type="number"
        value={liabilities}
        onChange={(e) => setLiabilities(Number(e.target.value))}
      />

      <h3>
        Net Worth: ₹{(assets - liabilities).toLocaleString()}
      </h3>

      <button
        className="danger"
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Reset All Data
      </button>
    </div>
  );
}
