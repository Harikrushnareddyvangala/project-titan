/**
 * ============================================================================
 * TITAN Shared Health Utilities
 * ============================================================================
 */

export function scoreToHealth(
  score: number,
):

  | "Excellent"
  | "Good"
  | "Needs Attention"
  | "Critical" {

  if (score >= 90) {

    return "Excellent";

  }

  if (score >= 70) {

    return "Good";

  }

  if (score >= 40) {

    return "Needs Attention";

  }

  return "Critical";

}