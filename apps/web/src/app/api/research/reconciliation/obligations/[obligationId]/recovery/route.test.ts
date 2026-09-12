import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ResearchReconciliationObligationRecoveryPlanningResult } from "@/lib/research/reconciliationObligation/recoveryPlanning";

const { planResearchReconciliationObligationRecoveryOnServer } = vi.hoisted(
  () => ({
    planResearchReconciliationObligationRecoveryOnServer: vi.fn(),
  }),
);

vi.mock(
  "@/lib/research/reconciliationObligation/recoveryPlanning",
  () => ({
    planResearchReconciliationObligationRecoveryOnServer,
  }),
);

import { POST } from "./route";

const planningResult: ResearchReconciliationObligationRecoveryPlanningResult =
  {
    obligationId: "research-reconciliation-001",
    investigationId: "investigation-001",
    status: "Planned",
    obligation: {
      id: "research-reconciliation-001",
      investigationId: "investigation-001",
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-001",
      remediationAction: "RepairReference",
      provenanceEventId: "provenance-001",
      status: "Open",
      reason:
        "Committed remediation left an invalid conclusion finding reference.",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    issue: {
      code: "CONCLUSION_FINDING_REFERENCE_INVALID",
      message: "Conclusion references an invalid finding.",
      investigationId: "investigation-001",
      targetId: "conclusion-001",
    },
    request: {
      investigationId: "investigation-001",
      action: "RepairReference",
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      target: {
        targetId: "conclusion-001",
      },
      confirmed: false,
    },
    plan: {
      investigationId: "investigation-001",
      action: "RepairReference",
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      target: {
        targetId: "conclusion-001",
      },
      confirmed: false,
      status: "Planned",
      description: "Fresh recovery plan.",
    },
    reason:
      "The current integrity issue remains unresolved and a fresh unconfirmed remediation plan has been prepared.",
  };

function createRequest(obligationId = "research-reconciliation-001") {
  return new Request(
    `http://localhost/api/research/reconciliation/obligations/${obligationId}/recovery`,
    {
      method: "POST",
    },
  );
}

function createParams(obligationId: string) {
  return Promise.resolve({ obligationId });
}

describe("POST /api/research/reconciliation/obligations/[obligationId]/recovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("plans recovery through the server boundary", async () => {
    planResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
      planningResult,
    );

    const response = await POST(createRequest(), {
      params: createParams("research-reconciliation-001"),
    });

    expect(response.status).toBe(200);
    expect(
      planResearchReconciliationObligationRecoveryOnServer,
    ).toHaveBeenCalledTimes(1);
    expect(
      planResearchReconciliationObligationRecoveryOnServer,
    ).toHaveBeenCalledWith("research-reconciliation-001");

    await expect(response.json()).resolves.toEqual(planningResult);
  });

  it("returns 404 when the reconciliation obligation does not exist", async () => {
    planResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
      null,
    );

    const response = await POST(
      createRequest("missing-obligation"),
      {
        params: createParams("missing-obligation"),
      },
    );

    expect(response.status).toBe(404);
    expect(
      planResearchReconciliationObligationRecoveryOnServer,
    ).toHaveBeenCalledWith("missing-obligation");

    await expect(response.json()).resolves.toEqual({
      error: "Reconciliation obligation not found.",
    });
  });

  it("returns NotRequired without changing the planning result", async () => {
    const result = {
      ...planningResult,
      status: "NotRequired" as const,
      issue: undefined,
      request: undefined,
      plan: undefined,
      reason:
        "The integrity condition represented by the reconciliation obligation is no longer present.",
    };

    planResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
      result,
    );

    const response = await POST(createRequest(), {
      params: createParams("research-reconciliation-001"),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(result);
  });

  it("returns NotRepairable without changing the planning result", async () => {
    const result = {
      ...planningResult,
      status: "NotRepairable" as const,
      request: undefined,
      plan: undefined,
      reason:
        "The current integrity issue does not produce an executable remediation request.",
    };

    planResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
      result,
    );

    const response = await POST(createRequest(), {
      params: createParams("research-reconciliation-001"),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(result);
  });

  it("returns 500 for an unexpected recovery planning failure", async () => {
    planResearchReconciliationObligationRecoveryOnServer.mockRejectedValue(
      new Error("unexpected planning failure"),
    );

    const response = await POST(createRequest(), {
      params: createParams("research-reconciliation-001"),
    });

    expect(response.status).toBe(500);

    await expect(response.json()).resolves.toEqual({
      error: "Research reconciliation recovery planning failed.",
    });
  });

  it("does not execute or resolve the obligation at the invocation boundary", async () => {
    planResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
      planningResult,
    );

    const response = await POST(createRequest(), {
      params: createParams("research-reconciliation-001"),
    });

    expect(response.status).toBe(200);
    expect(
      planResearchReconciliationObligationRecoveryOnServer,
    ).toHaveBeenCalledTimes(1);
    expect(
      planResearchReconciliationObligationRecoveryOnServer,
    ).toHaveBeenCalledWith("research-reconciliation-001");
  });
});
