import SummaryCard from "../components/SummaryCard";

export default function Dashboard({
  income,
  spending,
  savings,
  transactions,
}) {
  return (
    <>
      <div className="cards">
        <SummaryCard title="Income" value={`₹${income}`} color="#16A34A" />
        <SummaryCard
          title="Spending"
          value={`₹${spending}`}
          color="#EA580C"
        />
        <SummaryCard title="Savings" value={`${savings}%`} color="#2563EB" />
        <SummaryCard
          title="Transactions"
          value={transactions.length}
          color="#6558D3"
        />
      </div>

      <div className="panel">
        <h3>Recent Transactions</h3>

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.slice(0, 5).map((t, i) => (
            <div className="tx" key={i}>
              <div>
                <strong>{t.merchant}</strong>
                <br />
                <small>
                  {t.date} • {t.category}
                </small>
              </div>

              <div className={t.type === "income" ? "income" : "expense"}>
                {t.type === "income" ? "+" : "-"}₹{t.amount}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
