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

/**
 * Determines whether a lifecycle state transition is valid for the
 * canonical execution lifecycle.
 */
export function canTransitionExecutionLifecycle(
  from: ExecutionLifecycleState,
  to: ExecutionLifecycleState,
): boolean {
  if (from === to) {
    return false;
  }

  if (from === "Running") {
    return to === "Completed" || to === "Failed";
  }

  return false;
}

/**
 * Applies a validated lifecycle transition.
 *
 * Throws when the requested transition is not permitted by the
 * canonical execution lifecycle policy.
 */
export function transitionExecutionLifecycle(
  lifecycle: ExecutionLifecycle,
  execution: ExecutionIdentity,
  to: ExecutionLifecycleState,
  reason?: string,
  timestamp?: string,
): ExecutionLifecycle {
  if (!canTransitionExecutionLifecycle(lifecycle.currentState, to)) {
    throw new Error(
      `Invalid execution lifecycle transition: ${lifecycle.currentState} -> ${to}`,
    );
  }

  const transition: ExecutionLifecycleTransition = {
    id: crypto.randomUUID(),
    execution,
    from: lifecycle.currentState,
    to,
    ...(reason !== undefined ? { reason } : {}),
    timestamp: timestamp ?? new Date().toISOString(),
  };

  return {
    currentState: to,
    transitions: [...lifecycle.transitions, transition],
  };
}
