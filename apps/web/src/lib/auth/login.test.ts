import { beforeEach, describe, expect, it, vi } from "vitest";

import { beginLogin } from "./login";
import { loadOAuthState, loadPkceVerifier } from "./transaction";

describe("beginLogin", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("creates a PKCE and OAuth state transaction and authorization URL", async () => {
    const url = await beginLogin({
      domain: "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com",
      clientId: "example-client",
      redirectUri: "http://localhost:3000/auth/callback",
      scopes: ["openid", "email", "profile"],
    });

    expect(url.toString()).toContain(
      "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com/oauth2/authorize",
    );

    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("client_id")).toBe("example-client");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "http://localhost:3000/auth/callback",
    );
    expect(url.searchParams.get("scope")).toBe("openid email profile");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("code_challenge")).toMatch(
      /^[A-Za-z0-9_-]+$/,
    );

    const state = url.searchParams.get("state");

    expect(state).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(state?.length).toBeGreaterThanOrEqual(43);

    const verifier = loadPkceVerifier();
    const storedState = loadOAuthState();

    expect(verifier).toMatch(/^[A-Za-z0-9._~-]+$/);
    expect(verifier?.length).toBeGreaterThanOrEqual(43);
    expect(verifier?.length).toBeLessThanOrEqual(128);
    expect(storedState).toBe(state);
  });
});
