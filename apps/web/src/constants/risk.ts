/**
 * ============================================================================
 * TITAN Engineering Intelligence Platform
 * Repository Risk Configuration
 * ============================================================================
 */

/**
 * Default contribution of each intelligence dimension
 * towards overall repository risk.
 */
export const DEFAULT_RISK_WEIGHTS = {

  engineering: 0.30,

  security: 0.25,

  production: 0.20,

  enterprise: 0.10,

  hiring: 0.05,

  stability: 0.05,

  confidence: 0.05,

} as const;

/**
 * Portfolio Risk Thresholds
 *
 * Score ≥ threshold.
 */
export const RISK_THRESHOLDS = {

  veryLow: 90,

  low: 80,

  moderate: 70,

  elevated: 60,

  high: 45,

} as const;