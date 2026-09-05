import type {
  ActorIdentity,
  ExecutionIdentity,
  RoleReference,
} from "./index.js";

/**
 * An actor's contextual participation in a TITAN execution.
 *
 * ExecutionActorParticipation identifies an immutable assertion that
 * an actor participated in a specific execution under a vocabulary-
 * defined role.
 */
export interface ExecutionActorParticipation {
  /** Stable opaque identity of this participation assertion. */
  id: string;

  /** Execution occurrence in which the actor participated. */
  execution: ExecutionIdentity;

  /** Actor or entity participating in the execution. */
  actor: ActorIdentity;

  /** Vocabulary-defined role under which the actor participated. */
  role: RoleReference;

  /** Time at which TITAN established this participation assertion. */
  createdAt: string;
}
