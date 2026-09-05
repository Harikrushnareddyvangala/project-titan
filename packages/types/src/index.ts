export type {
  ResourceIdentity,
  ResourceRevision,
} from "./resource.js";

export type {
  ResourceRelationship,
} from "./relationship.js";

export type {
  ActorIdentity,
} from "./actor.js";

export type { RoleReference } from "./role.js";

export type { OperationReference } from "./operation.js";

export type { ExecutionIdentity } from "./execution.js";

export {
  canTransitionExecutionLifecycle,
  transitionExecutionLifecycle,
} from "./executionLifecycle.js";

export type {
  ExecutionLifecycle,
  ExecutionLifecycleState,
  ExecutionLifecycleTransition,
} from "./executionLifecycle.js";

export type {
  ExecutionActorParticipation,
} from "./participation.js";

export type {
  ExecutionResourceInteraction,
} from "./interaction.js";
