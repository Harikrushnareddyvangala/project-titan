import { beforeEach, describe, expect, it, vi } from "vitest";

import { exchangeAuthorizationCode } from "./token";

describe("exchangeAuthorizationCode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exchanges an authorization code using PKCE", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            access_token: "example-access-token",
            refresh_token: "example-refresh-token",
            id_token: "example-id-token",
            token_type: "Bearer",
            expires_in: 3600,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

    const result = await exchangeAuthorizationCode({
      domain: "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com",
      clientId: "example-client",
      redirectUri: "http://localhost:3000/auth/callback",
      code: "example-authorization-code",
      codeVerifier: "example-code-verifier",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [input, init] = fetchMock.mock.calls[0];

    expect(input).toBeInstanceOf(URL);
    expect((input as URL).toString()).toBe(
      "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com/oauth2/token",
    );

    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const body = new URLSearchParams(init?.body as string);

    expect(body.get("grant_type")).toBe("authorization_code");
    expect(body.get("client_id")).toBe("example-client");
    expect(body.get("code")).toBe("example-authorization-code");
    expect(body.get("redirect_uri")).toBe(
      "http://localhost:3000/auth/callback",
    );
    expect(body.get("code_verifier")).toBe("example-code-verifier");

    expect(result).toEqual({
      accessToken: "example-access-token",
      refreshToken: "example-refresh-token",
      idToken: "example-id-token",
      tokenType: "Bearer",
      expiresIn: 3600,
    });
  });

  it("rejects a non-successful token response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "invalid_grant",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    await expect(
      exchangeAuthorizationCode({
        domain: "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com",
        clientId: "example-client",
        redirectUri: "http://localhost:3000/auth/callback",
        code: "example-authorization-code",
        codeVerifier: "example-code-verifier",
      }),
    ).rejects.toThrow("Token exchange failed.");
  });

  it("rejects a malformed successful token response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          token_type: "Bearer",
          expires_in: 3600,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    await expect(
      exchangeAuthorizationCode({
        domain: "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com",
        clientId: "example-client",
        redirectUri: "http://localhost:3000/auth/callback",
        code: "example-authorization-code",
        codeVerifier: "example-code-verifier",
      }),
    ).rejects.toThrow("Token response is invalid.");
  });
});
