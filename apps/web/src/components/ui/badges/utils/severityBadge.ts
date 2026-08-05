import type { BadgeVariant, } from "../badgeTypes";

export function severityBadge(

  severity: string,

): BadgeVariant {

  switch (severity) {

    case "Critical":

      return "danger";

    case "Warning":

      return "warning";

    case "Recommendation":

      return "info";

    default:

      return "neutral";

  }

}