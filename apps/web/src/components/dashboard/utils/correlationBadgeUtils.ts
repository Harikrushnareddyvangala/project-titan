import type {
  InsightPriority,
  InsightConfidence,
} from "@/types/correlation";

import type {
  BadgeVariant,
} from "@/components/ui/badges/badgeTypes";

export function getPriorityVariant(
  priority: InsightPriority,
): BadgeVariant {

  switch (priority) {

    case "Critical":
      return "danger";

    case "High":
      return "warning";

    case "Medium":
      return "info";

    case "Low":
      return "success";

    default:
      return "neutral";

  }

}

export function getConfidenceVariant(
  confidence: InsightConfidence,
): BadgeVariant {

  switch (confidence) {

    case "Very High":
      return "success";

    case "High":
      return "info";

    case "Medium":
      return "warning";

    case "Low":
      return "danger";

    default:
      return "neutral";

  }

}   