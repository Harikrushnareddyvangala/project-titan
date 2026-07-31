import { TrendIndicator } from "./TrendIndicator";

interface TrendMetricCardProps {
  title: string;
  value: number;
  delta: number;
}

export function TrendMetricCard({
  title,
  value,
  delta,
}: TrendMetricCardProps) {
  return (
    <div className="rounded-lg border p-4">

      <div className="text-sm text-muted-foreground">
        {title}
      </div>

      <div className="mt-2 text-3xl font-bold">
        {value.toFixed(2)}
      </div>

      <div className="mt-3">
        <TrendIndicator value={delta} />
      </div>

    </div>
  );
}