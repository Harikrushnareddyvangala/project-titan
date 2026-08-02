import { TrendIndicator } from "../indicators/TrendIndicator";

interface GrowthBadgeProps {
  value: number;

  suffix?: string;

  precision?: number;
}

export function GrowthBadge({
  value,
  suffix = "%",
  precision = 1,
}: GrowthBadgeProps) {
  return (
    <TrendIndicator
      value={value}
      suffix={suffix}
      precision={precision}
    />
  );
}