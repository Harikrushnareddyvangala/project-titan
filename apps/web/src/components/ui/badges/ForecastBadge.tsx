import { StatusBadge } from "./StatusBadge";
import type {
  ForecastDirection,
} from "@/types/intelligence";
interface ForecastBadgeProps {
  direction:
    ForecastDirection;
}

export function ForecastBadge({
  direction,
}: ForecastBadgeProps) {
  const variant =
    direction === "Strong Growth"
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