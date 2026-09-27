export interface BrowserAuthSession {
  accessToken: string;
  expiresAt: number;
}

export function createBrowserAuthSession(
  accessToken: string,
  expiresIn: number,
  now: number = Date.now(),
): BrowserAuthSession {
  return {
    accessToken,
    expiresAt: now + expiresIn * 1000,
  };
}

export function isBrowserAuthSessionValid(
  session: BrowserAuthSession,
  now: number = Date.now(),
): boolean {
  return (
    session.accessToken.trim().length > 0 &&
    Number.isFinite(session.expiresAt) &&
    now < session.expiresAt
  );
}
