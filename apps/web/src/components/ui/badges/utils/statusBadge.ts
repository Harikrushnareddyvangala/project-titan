import type { BadgeVariant } from "../badgeTypes";

export function statusBadge(
  status: string,
): BadgeVariant {

  switch (status) {

    case "Completed":
      return "success";

    case "In Progress":
    case "Active":
      return "info";

    case "Blocked":
      return "danger";

    default:
      return "neutral";

  }

}