/**
 * ============================================================================
 * TITAN Shared Trend Utilities
 * ============================================================================
 */

export function trendDirection(

  delta: number,

):

  | "Improving"
  | "Stable"
  | "Declining" {

  if (delta > 2) {

    return "Improving";

  }

  if (delta < -2) {

    return "Declining";

  }

  return "Stable";

}