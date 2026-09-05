import type {
  ExecutionIdentity,
  OperationReference,
  ResourceIdentity,
  ResourceRevision,
} from "./index.js";

/**
 * Immutable assertion that an execution interacted with a resource.
 *
 * The target may identify either the conceptual resource itself or
 * a particular revision when revision-level precision is required.
 */
export interface ExecutionResourceInteraction {
  /** Stable identity of this interaction assertion. */
  id: string;

  /** Concrete execution occurrence in which the interaction took place. */
  execution: ExecutionIdentity;

  /** Resource or specific resource revision targeted by the interaction. */
  target: ResourceIdentity | ResourceRevision;

  /** Vocabulary term defining the semantic operation. */
  operation: OperationReference;

  /** Time at which TITAN established this interaction assertion. */
  createdAt: string;
}
