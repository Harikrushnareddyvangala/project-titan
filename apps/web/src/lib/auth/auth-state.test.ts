import { describe, expect, it } from "vitest";

import {
  clearBrowserAuthSession,
  createInitialAuthState,
  setBrowserAuthSession,
} from "./auth-state";

import type { BrowserAuthSession } from "./session";

describe("browser auth state", () => {
  const session: BrowserAuthSession = {
    accessToken: "example-access-token",
    expiresAt: 2_000_000,
  };

  it("starts anonymous", () => {
    expect(createInitialAuthState()).toEqual({
      session: null,
    });
  });

  it("sets a browser auth session", () => {
    expect(setBrowserAuthSession({ session: null }, session)).toEqual({
      session,
    });
  });

  it("clears a browser auth session", () => {
    expect(clearBrowserAuthSession({ session })).toEqual({
      session: null,
    });
  });
});
