export default function SummaryCard({ title, value, color }) {
  return (
    <div className="card">
      <small>{title}</small>
      <h2 style={{ color }}>{value}</h2>
    </div>
  );
}
