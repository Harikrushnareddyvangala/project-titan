import { describe, expect, it } from "vitest";

import { buildAuthorizationUrl } from "./authorize";

describe("buildAuthorizationUrl", () => {
  it("builds a Cognito authorization URL with PKCE and OAuth state", () => {
    const url = buildAuthorizationUrl({
      domain: "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com",
      clientId: "example-client",
      redirectUri: "http://localhost:3000/auth/callback",
      scopes: ["openid", "email", "profile"],
      codeChallenge: "example-code-challenge",
      state: "example-oauth-state",
    });

    expect(url.toString()).toBe(
      "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com/oauth2/authorize" +
        "?response_type=code" +
        "&client_id=example-client" +
        "&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback" +
        "&scope=openid+email+profile" +
        "&code_challenge=example-code-challenge" +
        "&code_challenge_method=S256" +
        "&state=example-oauth-state",
    );
  });
});
