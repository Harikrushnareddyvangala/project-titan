/**
 * ============================================================================
 * TITAN Shared Confidence Utilities
 * ============================================================================
 */

export function clampConfidence(
  confidence: number,
): number {

  return Math.max(
    0,
    Math.min(100, confidence),
  );

}

export function averageConfidence(
  values: number[],
): number {

  if (values.length === 0) {

    return 0;

  }

  return (
    values.reduce(
      (sum, value) =>
        sum + value,
      0,
    ) / values.length
  );

}