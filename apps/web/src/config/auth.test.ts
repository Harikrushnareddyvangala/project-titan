import { describe, expect, it } from "vitest";

import { validateCognitoAuthConfig } from "./auth";

describe("validateCognitoAuthConfig", () => {
  it("accepts a complete browser Cognito configuration", () => {
    expect(() =>
      validateCognitoAuthConfig({
        domain:
          "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com",
        clientId: "example-client",
        redirectUri: "http://localhost:3000/auth/callback",
        logoutUri: "http://localhost:3000/",
      }),
    ).not.toThrow();
  });

  it("rejects an incomplete browser Cognito configuration", () => {
    expect(() =>
      validateCognitoAuthConfig({
        domain: "",
        clientId: "example-client",
        redirectUri: "http://localhost:3000/auth/callback",
        logoutUri: "http://localhost:3000/",
      }),
    ).toThrow("NEXT_PUBLIC_COGNITO_DOMAIN");
  });
});
