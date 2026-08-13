export default function Goals() {
  return (
    <div className="panel">
      <h2>Savings Goals</h2>

      <div className="goal">
        <strong>Emergency Fund</strong>
        <p>₹0 of ₹3,00,000</p>
        <div className="progress">
          <div style={{ width: "0%" }}></div>
        </div>
      </div>

      <div className="goal">
        <strong>New Car</strong>
        <p>₹0 of ₹8,00,000</p>
        <div className="progress">
          <div style={{ width: "0%" }}></div>
        </div>
      </div>
    </div>
  );
}
