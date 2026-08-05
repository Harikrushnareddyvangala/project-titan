import type {
  RiskTrend,
} from "@/types/risk";
import type {
  RiskLevel,
} from "@/types/intelligence";
import type {
  BadgeVariant,
} from "./badgeTypes";



/**
 * Maps engineering risk level to a StatusBadge variant.
 */
export function getRiskBadgeVariant(
  level: RiskLevel,
): BadgeVariant {

  switch (level) {

    case "Very Low":
      return "success";

    case "Low":
      return "info";

    case "Moderate":
      return "warning";

    case "Elevated":
      return "warning";

    case "High":
      return "danger";

    case "Critical":
      return "danger";

  }

}

/**
 * Maps engineering trend to a StatusBadge variant.
 */
export function getRiskTrendBadgeVariant(
  trend: RiskTrend,
): BadgeVariant {

  switch (trend) {

    case "Rapidly Improving":
      return "success";

    case "Improving":
      return "info";

    case "Stable":
      return "neutral";

    case "Worsening":
      return "warning";

    case "Rapidly Worsening":
      return "danger";

  }

}