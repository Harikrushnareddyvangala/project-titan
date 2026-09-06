import type { ExecutionIdentity } from "./execution.js";

import {
  createExecutionLifecycle,
  transitionExecutionLifecycle,
  type ExecutionLifecycle,
  type ExecutionLifecycleState,
} from "./executionLifecycle.js";

import type { ExecutionTemporalContext } from "./executionTemporal.js";

/**
 * Canonical representation of one TITAN execution occurrence.
 *
 * Execution composes its intrinsic identity, lifecycle, and temporal
 * context. Participation and resource interaction remain separate
 * execution-scoped capabilities.
 */
export interface Execution {
  /** Stable identity of this execution occurrence. */
  identity: ExecutionIdentity;

  /** Lifecycle state and immutable transition history. */
  lifecycle: ExecutionLifecycle;

  /** Actual execution timing when known. */
  temporal: ExecutionTemporalContext;
}

/**
 * Creates the initial representation of one execution occurrence.
 *
 * Construction establishes identity and the initial lifecycle state.
 * It does not fabricate an execution start timestamp or lifecycle
 * transition.
 */
export function createExecution(
  id: string,
  options?: {
    startedAt?: string;
  },
): Execution {
  return {
    identity: { id },
    lifecycle: createExecutionLifecycle(),
    temporal:
      options?.startedAt !== undefined
        ? { startedAt: options.startedAt }
        : {},
  };
}

/**
 * Establishes the actual start time of an execution occurrence.
 *
 * Start-time establishment is a one-time temporal assertion.
 * It does not change lifecycle state or create lifecycle history.
 */
export function establishExecutionStart(
  execution: Execution,
  startedAt: string,
): Execution {
  if (execution.temporal.startedAt !== undefined) {
    throw new Error(
      "Execution start time has already been established.",
    );
  }

  if (
    execution.temporal.endedAt !== undefined &&
    startedAt > execution.temporal.endedAt
  ) {
    throw new Error(
      "Execution start time must not follow execution termination time.",
    );
  }

  return {
    ...execution,
    temporal: {
      ...execution.temporal,
      startedAt,
    },
  };
}

export function transitionExecution(
  execution: Execution,
  to: ExecutionLifecycleState,
  options: {
    endedAt: string;
    reason?: string;
    timestamp?: string;
  },
): Execution {
  if (
    execution.temporal.startedAt !== undefined &&
    options.endedAt < execution.temporal.startedAt
  ) {
    throw new Error(
      "Execution termination time must not precede execution start time.",
    );
  }

  const lifecycle = transitionExecutionLifecycle(
    execution.lifecycle,
    execution.identity,
    to,
    options.reason,
    options.timestamp,
  );

  return {
    ...execution,
    lifecycle,
    temporal: {
      ...execution.temporal,
      endedAt: options.endedAt,
    },
  };
}
