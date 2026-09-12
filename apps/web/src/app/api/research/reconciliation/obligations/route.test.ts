import { beforeEach, describe, expect, it, vi } from "vitest";

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

import { GET } from "./route";

describe("GET /api/research/reconciliation/obligations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
