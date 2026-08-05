import type { BadgeVariant } from "../badgeTypes";

export function priorityBadge(
  priority: string,
): BadgeVariant {

  switch (priority) {

    case "Critical":
      return "danger";

    case "High":
      return "warning";

    case "Medium":
      return "info";

    default:
      return "success";

  }

}