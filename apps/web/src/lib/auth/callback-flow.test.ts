import { beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  exchangeAuthorizationCode: vi.fn(),
}));

vi.mock("./token", () => ({
  exchangeAuthorizationCode: authMocks.exchangeAuthorizationCode,
}));

import { completeBrowserLogin } from "./callback-flow";

import {
  clearPkceTransaction,
  saveOAuthState,
  savePkceVerifier,
} from "./transaction";

describe("completeBrowserLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("completes the authorization-code flow and clears the transaction", async () => {
    saveOAuthState("expected-state");
    savePkceVerifier("test-verifier");

    authMocks.exchangeAuthorizationCode.mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      idToken: "id-token",
      tokenType: "Bearer",
      expiresIn: 3600,
    });

    const result = await completeBrowserLogin({
      code: "authorization-code",
      state: "expected-state",
    });

    expect(result.session.accessToken).toBe("access-token");
    expect(result.session.expiresAt).toBeGreaterThan(Date.now());

    expect(authMocks.exchangeAuthorizationCode).toHaveBeenCalledOnce();
    expect(authMocks.exchangeAuthorizationCode).toHaveBeenCalledWith({
      domain: expect.any(String),
      clientId: expect.any(String),
      redirectUri: expect.any(String),
      code: "authorization-code",
      codeVerifier: "test-verifier",
    });

    expect(sessionStorage.getItem("titan:auth:oauth-state")).toBeNull();
    expect(sessionStorage.getItem("titan:auth:pkce-verifier")).toBeNull();
  });

  it("rejects when the OAuth transaction is missing", async () => {
    await expect(
      completeBrowserLogin({
        code: "authorization-code",
        state: "expected-state",
      }),
    ).rejects.toThrow("OAuth transaction is missing.");

    expect(authMocks.exchangeAuthorizationCode).not.toHaveBeenCalled();
  });

  it("rejects when the PKCE transaction is missing", async () => {
    saveOAuthState("expected-state");

    await expect(
      completeBrowserLogin({
        code: "authorization-code",
        state: "expected-state",
      }),
    ).rejects.toThrow("PKCE transaction is missing.");

    expect(authMocks.exchangeAuthorizationCode).not.toHaveBeenCalled();
  });

  it("clears the transaction when token exchange fails", async () => {
    saveOAuthState("expected-state");
    savePkceVerifier("test-verifier");

    authMocks.exchangeAuthorizationCode.mockRejectedValue(
      new Error("Token exchange failed."),
    );

    await expect(
      completeBrowserLogin({
        code: "authorization-code",
        state: "expected-state",
      }),
    ).rejects.toThrow("Token exchange failed.");

    expect(sessionStorage.getItem("titan:auth:oauth-state")).toBeNull();
    expect(sessionStorage.getItem("titan:auth:pkce-verifier")).toBeNull();
  });

  it("does not exchange a callback with an invalid state", async () => {
    saveOAuthState("expected-state");
    savePkceVerifier("test-verifier");

    await expect(
      completeBrowserLogin({
        code: "authorization-code",
        state: "wrong-state",
      }),
    ).rejects.toThrow("OAuth state validation failed.");

    expect(authMocks.exchangeAuthorizationCode).not.toHaveBeenCalled();

    // Validation failure occurs before the exchange boundary.
    // The transaction remains available for controlled error handling.
    expect(sessionStorage.getItem("titan:auth:oauth-state")).toBe(
      "expected-state",
    );
    expect(sessionStorage.getItem("titan:auth:pkce-verifier")).toBe(
      "test-verifier",
    );

    clearPkceTransaction();
  });
});
