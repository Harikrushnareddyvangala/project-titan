import { describe, expect, it } from "vitest";

import {
  generateCodeChallenge,
  generateCodeVerifier,
} from "./pkce";

describe("PKCE", () => {
  it("generates a verifier suitable for PKCE", () => {
    const verifier = generateCodeVerifier();

    expect(verifier).toMatch(/^[A-Za-z0-9._~-]+$/);
    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(verifier.length).toBeLessThanOrEqual(128);
  });

  it("derives a deterministic challenge from a verifier", async () => {
    const verifier =
      "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";

    const challenge = await generateCodeChallenge(verifier);

    expect(challenge).toBe(
      "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    );
  });
});
