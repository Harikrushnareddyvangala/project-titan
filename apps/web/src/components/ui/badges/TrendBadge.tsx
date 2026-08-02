import { StatusBadge } from "./StatusBadge";
import type {
  TrendDirection,
} from "@/types/intelligence";

interface TrendBadgeProps {
  direction:
    TrendDirection;
}

export function TrendBadge({
  direction,
}: TrendBadgeProps) {
  const variant =
    direction === "Rapid Growth"
      ? "success"
      : direction === "Growing"
      ? "success"
      : direction === "Stable"
      ? "neutral"
      : direction === "Declining"
      ? "warning"
      : "danger";

  return (
    <StatusBadge variant={variant}>
      {direction}
    </StatusBadge>
  );
}