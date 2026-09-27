import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthenticatedPrincipal } from "@titan/auth";

const authMocks = vi.hoisted(() => ({
  authenticateRequest: vi.fn<
    (request: Request) => Promise<AuthenticatedPrincipal>
  >(),
  UnauthenticatedRequestError: class extends Error {
    readonly status = 401;

    constructor(message = "Authentication required.") {
      super(message);
      this.name = "UnauthenticatedRequestError";
    }
  },
}));

vi.mock("@/lib/research/reconciliationObligation/resolution", () => ({
  resolveResearchReconciliationObligationOnServer: vi.fn(),
}));

vi.mock("@/lib/server/auth/principal", () => authMocks);

import { resolveResearchReconciliationObligationOnServer } from "@/lib/research/reconciliationObligation/resolution";
import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

import { POST } from "./route";

const mockedResolve =
  vi.mocked(resolveResearchReconciliationObligationOnServer);

const mockedAuthenticateRequest = vi.mocked(authenticateRequest);

beforeEach(() => {
  vi.clearAllMocks();

  mockedAuthenticateRequest.mockResolvedValue({
    provider: "cognito",
    subject: "test-subject",
  });
});

function createRequest(): Request {
  return new Request(
    "http://localhost/api/research/reconciliation/obligations/reconciliation-1/resolve",
    {
      method: "POST",
    },
  );
}

function createParams(obligationId: string) {
  return {
    params: Promise.resolve({ obligationId }),
  };
}

describe("POST /api/research/reconciliation/obligations/[obligationId]/resolve", () => {
  it("rejects an unauthenticated request before reaching the server boundary", async () => {
    mockedAuthenticateRequest.mockRejectedValue(
      new UnauthenticatedRequestError(),
    );

    const response = await POST(
      createRequest(),
      createParams("reconciliation-1"),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Authentication required.",
    });
    expect(mockedResolve).not.toHaveBeenCalled();
  });

  it("returns the server resolution result", async () => {
    const result = {
      obligation: {
        id: "reconciliation-1",
        status: "Resolved",
      },
      transitioned: true,
    };

    mockedResolve.mockResolvedValue(result as never);

    const response = await POST(
      createRequest(),
      createParams("reconciliation-1"),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(result);
    expect(mockedResolve).toHaveBeenCalledOnce();
    expect(mockedResolve).toHaveBeenCalledWith("reconciliation-1");
  });

  it("rejects an empty obligation id", async () => {
    const response = await POST(createRequest(), createParams(""));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Invalid reconciliation obligation.",
    });
    expect(mockedResolve).not.toHaveBeenCalled();
  });

  it("returns 404 when the obligation does not exist", async () => {
    mockedResolve.mockResolvedValue(null);

    const response = await POST(
      createRequest(),
      createParams("missing-obligation"),
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Reconciliation obligation not found.",
    });
  });

  it("returns a non-transition lifecycle result unchanged", async () => {
    const result = {
      obligation: {
        id: "reconciliation-1",
        status: "In Progress",
      },
      transitioned: false,
      reason: "Reconciliation obligation remains unresolved.",
    };

    mockedResolve.mockResolvedValue(result as never);

    const response = await POST(
      createRequest(),
      createParams("reconciliation-1"),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(result);
  });

  it("preserves a terminal lifecycle result unchanged", async () => {
    const result = {
      obligation: {
        id: "reconciliation-1",
        status: "Resolved",
      },
      transitioned: false,
      reason: "Reconciliation obligation is already terminal: Resolved.",
    };

    mockedResolve.mockResolvedValue(result as never);

    const response = await POST(
      createRequest(),
      createParams("reconciliation-1"),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(result);
  });

  it("returns 500 when resolution fails unexpectedly", async () => {
    mockedResolve.mockRejectedValue(new Error("resolution failed"));

    const response = await POST(
      createRequest(),
      createParams("reconciliation-1"),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Research reconciliation obligation resolution failed.",
    });
  });

  it("does not execute recovery or remediation at the invocation boundary", async () => {
    const result = {
      obligation: {
        id: "reconciliation-1",
        status: "Resolved",
      },
      transitioned: true,
    };

    mockedResolve.mockResolvedValue(result as never);

    const response = await POST(
      createRequest(),
      createParams("reconciliation-1"),
    );

    expect(response.status).toBe(200);
    expect(mockedResolve).toHaveBeenCalledTimes(1);
    expect(mockedResolve).toHaveBeenCalledWith("reconciliation-1");
  });
});
