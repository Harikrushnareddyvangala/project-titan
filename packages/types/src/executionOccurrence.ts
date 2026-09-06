import type { ExecutionIdentity } from "./execution.js";
import {
  createExecutionLifecycle,
  type ExecutionLifecycle,
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
export function createExecution(id: string): Execution {
  return {
    identity: { id },
    lifecycle: createExecutionLifecycle(),
    temporal: {},
  };
}
