const PKCE_VERIFIER_STORAGE_KEY = "titan:auth:pkce-verifier";
const OAUTH_STATE_STORAGE_KEY = "titan:auth:oauth-state";

export function savePkceVerifier(verifier: string): void {
  sessionStorage.setItem(PKCE_VERIFIER_STORAGE_KEY, verifier);
}

export function loadPkceVerifier(): string | null {
  return sessionStorage.getItem(PKCE_VERIFIER_STORAGE_KEY);
}

export function saveOAuthState(state: string): void {
  sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state);
}

export function loadOAuthState(): string | null {
  return sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY);
}

export function clearPkceTransaction(): void {
  sessionStorage.removeItem(PKCE_VERIFIER_STORAGE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY);
}
