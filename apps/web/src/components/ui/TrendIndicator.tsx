interface TrendIndicatorProps {
  value: number;
  precision?: number;
}

export function TrendIndicator({
  value,
  precision = 2,
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  const icon = isPositive
    ? "▲"
    : isNegative
      ? "▼"
      : "●";

  const color = isPositive
    ? "text-green-600"
    : isNegative
      ? "text-red-600"
      : "text-gray-500";

const badgeClass = isPositive
  ? "bg-green-100 text-green-700"
  : isNegative
    ? "bg-red-100 text-red-700"
    : "bg-gray-100 text-gray-700";


  return (
    <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}`}
  >
      <span>{icon}</span>

      <span>
        {value >= 0 ? "+" : ""}
        {value.toFixed(precision)}
      </span>
    </span>
  );
}