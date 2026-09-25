import { describe, expect, it } from "vitest";
import { createCognitoPrincipalVerifier } from "../src/cognito.js";

describe("createCognitoPrincipalVerifier", () => {
  it("creates a verifier function", () => {
    const verifyPrincipal = createCognitoPrincipalVerifier({
      userPoolId: "ap-south-1_example",
      clientId: "example-client",
    });

    expect(verifyPrincipal).toBeTypeOf("function");
  });
});
