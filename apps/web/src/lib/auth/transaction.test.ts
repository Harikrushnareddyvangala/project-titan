import { beforeEach, describe, expect, it } from "vitest";

import {
  clearPkceTransaction,
  loadOAuthState,
  loadPkceVerifier,
  saveOAuthState,
  savePkceVerifier,
} from "./transaction";

describe("OAuth transaction storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stores and loads the PKCE verifier", () => {
    savePkceVerifier("example-code-verifier");

    expect(loadPkceVerifier()).toBe("example-code-verifier");
  });

  it("stores and loads OAuth state", () => {
    saveOAuthState("example-state");

    expect(loadOAuthState()).toBe("example-state");
  });

  it("clears the complete OAuth transaction", () => {
    savePkceVerifier("example-code-verifier");
    saveOAuthState("example-state");

    clearPkceTransaction();

    expect(loadPkceVerifier()).toBeNull();
    expect(loadOAuthState()).toBeNull();
  });

  it("returns null when no OAuth transaction exists", () => {
    expect(loadPkceVerifier()).toBeNull();
    expect(loadOAuthState()).toBeNull();
  });
});
