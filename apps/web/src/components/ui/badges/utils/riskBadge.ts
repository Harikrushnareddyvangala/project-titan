import type { BadgeVariant } from "../badgeTypes";

export function riskBadge(
  risk: string,
): BadgeVariant {

  switch (risk) {

    case "Critical":
      return "danger";

    case "High":
      return "warning";

    case "Moderate":
      return "info";

    default:
      return "success";

  }

}