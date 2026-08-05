/**
 * ============================================================================
 * TITAN Shared Summary Utilities
 * ============================================================================
 */

export function pluralize(

  value: number,

  singular: string,

  plural: string,

): string {

  return value === 1
    ? singular
    : plural;

}