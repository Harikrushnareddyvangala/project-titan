import { StatusBadge } from "./StatusBadge";
import type {
  RiskLevel,
} from "@/types/intelligence";

interface RiskBadgeProps {
  risk:
    RiskLevel;
}

export function RiskBadge({
  risk,
}: RiskBadgeProps) {
  const variant =
    risk === "Very Low"
      ? "success"
      : risk === "Low"
      ? "info"
      : risk === "Moderate"
      ? "warning"
      : risk === "Elevated"
      ? "danger"
      : "danger";

  return (
    <StatusBadge variant={variant}>
      {risk}
    </StatusBadge>
  );
}