import { beforeEach, describe, expect, it, vi } from "vitest";

import { beginLogin } from "@/lib/auth/login";

vi.mock("@/lib/auth/login", () => ({
  beginLogin: vi.fn(),
}));

vi.mock("@/config/auth", () => ({
  COGNITO_AUTH_CONFIG: {
    domain: "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com",
    clientId: "example-client",
    redirectUri: "http://localhost:3000/auth/callback",
    logoutUri: "http://localhost:3000/",
    scopes: ["openid", "email", "profile"],
  },
  validateCognitoAuthConfig: vi.fn(),
}));

describe("/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates configuration before starting Cognito login", async () => {
    const authorizationUrl =
      "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com/oauth2/authorize" +
      "?response_type=code";

    vi.mocked(beginLogin).mockResolvedValue(new URL(authorizationUrl));

    const { startBrowserLogin } = await import("./page");

    const assign = vi.fn();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...window.location,
        assign,
      },
    });

    await startBrowserLogin();

    const { validateCognitoAuthConfig } = await import("@/config/auth");

    expect(validateCognitoAuthConfig).toHaveBeenCalledWith({
      domain: "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com",
      clientId: "example-client",
      redirectUri: "http://localhost:3000/auth/callback",
      logoutUri: "http://localhost:3000/",
    });

    expect(beginLogin).toHaveBeenCalledWith({
      domain: "https://titan-dev-auth.auth.ap-south-1.amazoncognito.com",
      clientId: "example-client",
      redirectUri: "http://localhost:3000/auth/callback",
      scopes: ["openid", "email", "profile"],
    });

    expect(assign).toHaveBeenCalledWith(authorizationUrl);
  });

  it("does not start Cognito login when configuration validation fails", async () => {
    const { validateCognitoAuthConfig } = await import("@/config/auth");

    vi.mocked(validateCognitoAuthConfig).mockImplementation(() => {
      throw new Error("NEXT_PUBLIC_COGNITO_DOMAIN is required.");
    });

    const { startBrowserLogin } = await import("./page");

    await expect(startBrowserLogin()).rejects.toThrow(
      "NEXT_PUBLIC_COGNITO_DOMAIN is required.",
    );

    expect(beginLogin).not.toHaveBeenCalled();
  });
});
