/**
 * ============================================================================
 * TITAN Shared Score Utilities
 * ============================================================================
 */

export function averageScore(
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

export function clampScore(
  score: number,
): number {

  return Math.max(
    0,
    Math.min(100, score),
  );

}