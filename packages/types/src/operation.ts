/**
 * Reference to an operation term defined by a vocabulary.
 *
 * OperationReference identifies the semantic vocabulary term used by
 * an execution-resource interaction. It does not define the operation's
 * implementation, lifecycle, identity, or versioning.
 */
export interface OperationReference {
  /** Namespace defining the operation vocabulary. */
  namespace: string;

  /** Operation term within the namespace vocabulary. */
  type: string;
}
