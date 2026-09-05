import type { ExecutionIdentity } from "./execution.js";

/**
 * Canonical lifecycle states for a TITAN execution occurrence.
 *
 * The lifecycle foundation intentionally starts with the smallest
 * execution-wide semantic set:
 * - Running
 * - Completed
 * - Failed
 */
export type ExecutionLifecycleState =
  | "Running"
  | "Completed"
  | "Failed";

/**
 * Immutable historical assertion that an execution changed lifecycle state.
 *
 * The transition identity identifies the historical assertion itself.
 * It is not derived from the execution or state values.
 */
export interface ExecutionLifecycleTransition {
  /** Stable opaque identity of this lifecycle transition. */
  id: string;

  /** Execution occurrence whose lifecycle changed. */
  execution: ExecutionIdentity;

  /** Previous lifecycle state. */
  from: ExecutionLifecycleState;

  /** Resulting lifecycle state. */
  to: ExecutionLifecycleState;

  /** Optional descriptive context for the transition. */
  reason?: string;

  /** Time at which TITAN established this transition assertion. */
  timestamp: string;
}

/**
 * Current lifecycle state and immutable transition history for an execution.
 */
export interface ExecutionLifecycle {
  /** Current lifecycle state of the execution. */
  currentState: ExecutionLifecycleState;

  /** Historical lifecycle transitions for the execution. */
  transitions: ExecutionLifecycleTransition[];
}
