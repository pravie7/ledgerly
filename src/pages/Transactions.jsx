import { useState } from "react";

export default function Transactions({
  transactions,
  setTransactions,
}) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Shopping");

  function add() {
    if (!merchant || !amount) return;

    setTransactions([
      {
        merchant,
        amount: Number(amount),
        type,
        category,
        date: new Date().toISOString().slice(0, 10),
      },
      ...transactions,
    ]);

    setMerchant("");
    setAmount("");
  }

  return (
    <>
      <div className="panel">
        <h3>Add Transaction</h3>

        <input
          placeholder="Merchant"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="row">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Shopping</option>
            <option>Groceries</option>
            <option>Dining</option>
            <option>Transport</option>
            <option>Utilities</option>
          </select>
        </div>

        <button onClick={add}>Add</button>
      </div>

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td>{t.date}</td>
                <td>{t.merchant}</td>
                <td>{t.category}</td>
                <td>{t.type === "income" ? "+" : "-"}₹{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
