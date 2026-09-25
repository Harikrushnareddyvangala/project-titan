/**
 * Canonical identity of an authenticated application principal.
 *
 * AuthenticatedPrincipal represents the security identity established
 * by an authentication authority. It does not represent a TITAN domain
 * actor, domain role, credential, authorization decision, or execution
 * participation.
 */
export interface AuthenticatedPrincipal {
  /** Authentication authority that established this identity. */
  provider: string;

  /** Stable subject identifier issued by that authority. */
  subject: string;
}
