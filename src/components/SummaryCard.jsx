export default function SummaryCard({
  title,
  value,
  color = "#6558D3",
  subtitle = "",
  trend = null,
}) {
  const trendColor =
    trend === null
      ? "#6B7280"
      : trend >= 0
      ? "#16A34A"
      : "#DC2626";

  const trendSymbol =
    trend === null ? "" : trend >= 0 ? "▲" : "▼";

  return (
    <div className="card">
      <small>{title}</small>

      <h2 style={{ color }}>{value}</h2>

      {subtitle && (
        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            color: "#6B7280",
          }}
        >
          {subtitle}
        </div>
      )}

      {trend !== null && (
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            fontWeight: 600,
            color: trendColor,
          }}
        >
          {trendSymbol} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
