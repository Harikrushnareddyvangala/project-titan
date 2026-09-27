import { describe, expect, it } from "vitest";

import {
  validateAuthorizationCallback,
  type AuthorizationCallbackParams,
} from "./callback";

describe("validateAuthorizationCallback", () => {
  it("accepts a matching state with an authorization code", () => {
    const params: AuthorizationCallbackParams = {
      code: "example-authorization-code",
      state: "example-state",
    };

    expect(
      validateAuthorizationCallback(params, "example-state"),
    ).toEqual({
      code: "example-authorization-code",
      state: "example-state",
    });
  });

  it("rejects a missing authorization code", () => {
    expect(() =>
      validateAuthorizationCallback(
        {
          state: "example-state",
        },
        "example-state",
      ),
    ).toThrow("Authorization code is required.");
  });

  it("rejects a missing state", () => {
    expect(() =>
      validateAuthorizationCallback(
        {
          code: "example-code",
        },
        "example-state",
      ),
    ).toThrow("OAuth state is required.");
  });

  it("rejects a mismatched state", () => {
    expect(() =>
      validateAuthorizationCallback(
        {
          code: "example-code",
          state: "attacker-controlled-state",
        },
        "example-state",
      ),
    ).toThrow("OAuth state validation failed.");
  });

  it("rejects an OAuth error response", () => {
    expect(() =>
      validateAuthorizationCallback(
        {
          error: "access_denied",
          error_description: "User denied access.",
        },
        "example-state",
      ),
    ).toThrow("Cognito authorization failed: User denied access.");
  });
});
