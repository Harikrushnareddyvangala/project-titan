/**
 * Temporal information associated with one execution occurrence.
 *
 * Timestamps describe the actual execution when known.
 * They are intentionally optional because TITAN may observe
 * incomplete or historical executions.
 */
export interface ExecutionTemporalContext {
  /** Actual time at which the execution began, when known. */
  startedAt?: string;

  /** Actual time at which the execution terminated, when known. */
  endedAt?: string;
}
