import type { ResourceIdentity } from "./resource.js";

/**
 * A directed relationship assertion between two TITAN resources.
 *
 * ResourceRelationship identifies the relationship assertion itself.
 * It does not represent a resource revision and does not encode
 * domain-specific relationship semantics beyond its namespace/type.
 */
export interface ResourceRelationship {
  /** Stable identity of this relationship assertion. */
  id: string;

  /** Resource from which the relationship originates. */
  source: ResourceIdentity;

  /** Resource toward which the relationship points. */
  target: ResourceIdentity;

  /** Namespace defining the relationship vocabulary. */
  namespace: string;

  /** Relationship type within the namespace vocabulary. */
  type: string;

  /** Time at which TITAN established this relationship assertion. */
  createdAt: string;
}
