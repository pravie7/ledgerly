export default function Budgets() {
  return (
    <div className="panel">
      <h2>Monthly Budgets</h2>

      <div className="budget">
        <div className="budgetRow">
          <span>Groceries</span>
          <span>₹0 / ₹10,000</span>
        </div>
        <div className="progress">
          <div style={{ width: "0%" }}></div>
        </div>
      </div>

      <div className="budget">
        <div className="budgetRow">
          <span>Shopping</span>
          <span>₹0 / ₹5,000</span>
        </div>
        <div className="progress">
          <div style={{ width: "0%" }}></div>
        </div>
      </div>
    </div>
  );
}
