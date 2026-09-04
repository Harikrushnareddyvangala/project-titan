/**
 * Canonical identity of a TITAN resource.
 *
 * ResourceIdentity identifies the conceptual resource itself.
 * It does not describe a particular revision or domain-specific
 * resource structure.
 */
export interface ResourceIdentity {
  /**
   * Stable identifier for the resource.
   */
  id: string;

  /**
   * Canonical resource type within its namespace.
   */
  type: string;

  /**
   * Domain or namespace responsible for defining the resource.
   */
  namespace: string;
}

/**
 * Identity of a particular revision of a TITAN resource.
 *
 * Revision information is deliberately separate from ResourceIdentity
 * because one conceptual resource may have many revisions over time.
 */
export interface ResourceRevision {
  /**
   * Stable identity of the resource being revised.
   */
  resource: ResourceIdentity;

  /**
   * Resource-specific version or revision identifier.
   *
   * The platform treats this value as opaque.
   */
  version: string;

  /**
   * Timestamp at which this revision was established.
   */
  createdAt: string;
}
