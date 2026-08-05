import type { BadgeVariant } from "../badgeTypes";

export function trendBadge(
  trend: string,
): BadgeVariant {

  switch (trend) {

    case "Improving":
      return "success";

    case "Stable":
      return "info";

    default:
      return "warning";

  }

}