import { describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  completeBrowserLogin: vi.fn(),
}));

vi.mock("@/lib/auth/callback-flow", () => ({
  completeBrowserLogin: authMocks.completeBrowserLogin,
}));

vi.mock("@/components/providers/AuthProvider", () => ({
  useAuth: () => ({
    setSession: vi.fn(),
  }),
}));

describe("/auth/callback", () => {
  it("exports the callback page", async () => {
    const callbackPageModule = await import("./page");

    expect(callbackPageModule.default).toBeTypeOf("function");
  });
});
