import { describe, expect, it } from "vitest";

import { generateOAuthState } from "./state";

describe("OAuth state", () => {
  it("generates a URL-safe random state value", () => {
    const state = generateOAuthState();

    expect(state).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(state.length).toBeGreaterThanOrEqual(43);
  });

  it("generates different state values across calls", () => {
    const first = generateOAuthState();
    const second = generateOAuthState();

    expect(first).not.toBe(second);
  });
});
