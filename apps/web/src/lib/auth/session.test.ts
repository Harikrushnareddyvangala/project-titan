import { describe, expect, it } from "vitest";

import {
  createBrowserAuthSession,
  isBrowserAuthSessionValid,
  type BrowserAuthSession,
} from "./session";

describe("browser auth session", () => {
  it("creates a session with an access token and absolute expiry", () => {
    const session = createBrowserAuthSession(
      "example-access-token",
      3600,
      1_000_000,
    );

    expect(session).toEqual({
      accessToken: "example-access-token",
      expiresAt: 4_600_000,
    });
  });

  it("accepts a session that has not expired", () => {
    const session: BrowserAuthSession = {
      accessToken: "example-access-token",
      expiresAt: 2_000_000,
    };

    expect(isBrowserAuthSessionValid(session, 1_999_999)).toBe(true);
  });

  it("rejects a session at its expiry time", () => {
    const session: BrowserAuthSession = {
      accessToken: "example-access-token",
      expiresAt: 2_000_000,
    };

    expect(isBrowserAuthSessionValid(session, 2_000_000)).toBe(false);
  });

  it("rejects an empty access token", () => {
    const session: BrowserAuthSession = {
      accessToken: "",
      expiresAt: 2_000_000,
    };

    expect(isBrowserAuthSessionValid(session, 1_000_000)).toBe(false);
  });
});
