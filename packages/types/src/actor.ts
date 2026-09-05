/**
 * Canonical identity of a TITAN actor or entity.
 *
 * ActorIdentity identifies the underlying actor itself.
 * It does not describe classification, roles, credentials,
 * trust relationships, or presentation metadata.
 */
export interface ActorIdentity {
  /** Stable identifier of the actor or entity. */
  id: string;
}
