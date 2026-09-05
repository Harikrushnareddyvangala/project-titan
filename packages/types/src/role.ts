/**
 * Reference to a role term defined by a vocabulary.
 *
 * RoleReference identifies the semantic vocabulary term used by a
 * contextual participation assertion. It does not define the role's
 * higher-order semantics, lifecycle, identity, or versioning.
 */
export interface RoleReference {
  /** Namespace defining the role vocabulary. */
  namespace: string;

  /** Role term within the namespace vocabulary. */
  type: string;
}
