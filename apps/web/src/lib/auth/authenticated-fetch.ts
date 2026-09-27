import {
  isBrowserAuthSessionValid,
  type BrowserAuthSession,
} from "./session";

export class UnauthenticatedBrowserRequestError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "UnauthenticatedBrowserRequestError";
  }
}

export function createAuthenticatedFetcher(
  session: BrowserAuthSession | null,
): typeof fetch {
  return async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    if (!session || !isBrowserAuthSessionValid(session)) {
      throw new UnauthenticatedBrowserRequestError();
    }

    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${session.accessToken}`);

    return fetch(input, {
      ...init,
      headers,
    });
  };
}
