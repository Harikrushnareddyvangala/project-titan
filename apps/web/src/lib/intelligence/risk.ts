/**
 * ============================================================================
 * TITAN Shared Risk Utilities
 * ============================================================================
 */

export function scoreToRisk(

  score: number,

):

  | "Very Low"
  | "Low"
  | "Moderate"
  | "Elevated"
  | "High"
  | "Critical" {

  if (score >= 95) {

    return "Very Low";

  }

  if (score >= 85) {

    return "Low";

  }

  if (score >= 70) {

    return "Moderate";

  }

  if (score >= 55) {

    return "Elevated";

  }

  if (score >= 40) {

    return "High";

  }

  return "Critical";

}