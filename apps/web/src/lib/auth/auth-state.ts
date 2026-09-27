import type { BrowserAuthSession } from "./session";

export interface BrowserAuthState {
  session: BrowserAuthSession | null;
}

export function createInitialAuthState(): BrowserAuthState {
  return {
    session: null,
  };
}

export function setBrowserAuthSession(
  _state: BrowserAuthState,
  session: BrowserAuthSession,
): BrowserAuthState {
  void _state;

  return {
    session,
  };
}

export function clearBrowserAuthSession(
  _state: BrowserAuthState,
): BrowserAuthState {
  void _state;

  return {
    session: null,
  };
}
