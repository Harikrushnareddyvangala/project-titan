/**
 * Canonical identity of a TITAN execution occurrence.
 *
 * ExecutionIdentity identifies one concrete occurrence of work.
 * It does not describe the operation, actor, status, retry semantics,
 * resources, or other execution context.
 */
export interface ExecutionIdentity {
  /** Stable opaque identifier of the execution occurrence. */
  id: string;
}
