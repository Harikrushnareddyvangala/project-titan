import type { BadgeVariant } from "../badgeTypes";

export function healthBadge(
  health: string,
): BadgeVariant {

  switch (health) {

    case "Excellent":
      return "success";

    case "Good":
      return "info";

    case "Needs Attention":
      return "warning";

    default:
      return "danger";

  }

}