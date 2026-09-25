import { describe, expect, it } from "vitest";

import { authenticateRequest } from "./principal";

describe("authenticateRequest", () => {
  it("rejects a request without a bearer token", async () => {
    await expect(
      authenticateRequest(new Request("http://localhost/api/test")),
    ).rejects.toThrow("Authentication required.");
  });
});
