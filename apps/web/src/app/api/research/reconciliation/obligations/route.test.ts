import { beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  authenticateRequest: vi.fn(),
  UnauthenticatedRequestError: class UnauthenticatedRequestError extends Error {
    readonly status = 401;

    constructor(message = "Authentication required.") {
      super(message);
      this.name = "UnauthenticatedRequestError";
    }
  },
}));

const {
  getResearchReconciliationObligationsByInvestigation,
} = vi.hoisted(() => ({
  getResearchReconciliationObligationsByInvestigation: vi.fn(),
}));

vi.mock(
  "@/lib/research/reconciliationObligation/serverRepository",
  () => ({
    getResearchReconciliationObligationsByInvestigation,
  }),
);

vi.mock("@/lib/server/auth/principal", () => authMocks);

import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";
import { GET } from "./route";

const mockedAuthenticateRequest = vi.mocked(authenticateRequest);

describe("GET /api/research/reconciliation/obligations", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedAuthenticateRequest.mockResolvedValue({
      provider: "cognito",
      subject: "test-subject",
    });
  });

  it("rejects an unauthenticated request before reaching the repository", async () => {
    mockedAuthenticateRequest.mockRejectedValue(
      new UnauthenticatedRequestError(),
    );

    const response = await GET(
      new Request(
        "http://localhost/api/research/reconciliation/obligations?investigationId=investigation-1",
      ),
    );

    expect(response.status).toBe(401);

    await expect(response.json()).resolves.toEqual({
      error: "Authentication required.",
    });

    expect(
      getResearchReconciliationObligationsByInvestigation,
    ).not.toHaveBeenCalled();
  });

  it("rejects a missing investigationId", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/research/reconciliation/obligations",
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid research investigation.",
    });

    expect(
      getResearchReconciliationObligationsByInvestigation,
    ).not.toHaveBeenCalled();
  });

  it("rejects a blank investigationId", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/research/reconciliation/obligations?investigationId=%20%20",
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid research investigation.",
    });

    expect(
      getResearchReconciliationObligationsByInvestigation,
    ).not.toHaveBeenCalled();
  });

  it("retrieves obligations for the requested investigation", async () => {
    const obligations = [
      {
        id: "obligation-1",
        investigationId: "investigation-1",
        issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-1",
        remediationAction: "RepairReference",
        status: "Open",
      },
    ];

    getResearchReconciliationObligationsByInvestigation.mockResolvedValue(
      obligations,
    );

    const response = await GET(
      new Request(
        "http://localhost/api/research/reconciliation/obligations?investigationId=%20investigation-1%20",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      obligations,
    });

    expect(
      getResearchReconciliationObligationsByInvestigation,
    ).toHaveBeenCalledTimes(1);
    expect(
      getResearchReconciliationObligationsByInvestigation,
    ).toHaveBeenCalledWith("investigation-1");
  });

  it("returns an empty obligation collection when none exist", async () => {
    getResearchReconciliationObligationsByInvestigation.mockResolvedValue(
      [],
    );

    const response = await GET(
      new Request(
        "http://localhost/api/research/reconciliation/obligations?investigationId=investigation-1",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      obligations: [],
    });
  });

  it("returns 500 when repository retrieval fails", async () => {
    getResearchReconciliationObligationsByInvestigation.mockRejectedValue(
      new Error("database unavailable"),
    );

    const response = await GET(
      new Request(
        "http://localhost/api/research/reconciliation/obligations?investigationId=investigation-1",
      ),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Research reconciliation obligation retrieval failed.",
    });
  });
});
