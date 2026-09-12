import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ResearchReconciliationObligationActivationResult } from "@/lib/research/reconciliationObligation/activation";

const { activateResearchReconciliationObligationOnServer } = vi.hoisted(
  () => ({
    activateResearchReconciliationObligationOnServer: vi.fn(),
  }),
);

vi.mock(
  "@/lib/research/reconciliationObligation/activation",
  () => ({
    activateResearchReconciliationObligationOnServer,
  }),
);

import { POST } from "./route";

const activationResult: ResearchReconciliationObligationActivationResult = {
  obligation: {
    id: "research-reconciliation-001",
    investigationId: "investigation-001",
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    targetEntityType: "Conclusion",
    targetEntityId: "conclusion-001",
    remediationAction: "RepairReference",
    provenanceEventId: "provenance-001",
    status: "In Progress",
    reason:
      "Committed remediation left an invalid conclusion finding reference.",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:01:00.000Z",
  },
  transitioned: true,
};

function createRequest(obligationId = "research-reconciliation-001") {
  return new Request(
    `http://localhost/api/research/reconciliation/obligations/${obligationId}/activate`,
    {
      method: "POST",
    },
  );
}

function createParams(obligationId: string) {
  return Promise.resolve({ obligationId });
}

describe(
  "POST /api/research/reconciliation/obligations/[obligationId]/activate",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("activates the reconciliation obligation through the server boundary", async () => {
      activateResearchReconciliationObligationOnServer.mockResolvedValue(
        activationResult,
      );

      const response = await POST(createRequest(), {
        params: createParams("research-reconciliation-001"),
      });

      expect(response.status).toBe(200);
      expect(
        activateResearchReconciliationObligationOnServer,
      ).toHaveBeenCalledTimes(1);
      expect(
        activateResearchReconciliationObligationOnServer,
      ).toHaveBeenCalledWith("research-reconciliation-001");

      await expect(response.json()).resolves.toEqual(activationResult);
    });

    it("returns 400 for an empty obligation id", async () => {
      const response = await POST(createRequest(""), {
        params: createParams(""),
      });

      expect(response.status).toBe(400);
      expect(
        activateResearchReconciliationObligationOnServer,
      ).not.toHaveBeenCalled();

      await expect(response.json()).resolves.toEqual({
        error: "Invalid reconciliation obligation.",
      });
    });

    it("returns 404 when the reconciliation obligation does not exist", async () => {
      activateResearchReconciliationObligationOnServer.mockResolvedValue(
        null,
      );

      const response = await POST(createRequest("missing-obligation"), {
        params: createParams("missing-obligation"),
      });

      expect(response.status).toBe(404);
      expect(
        activateResearchReconciliationObligationOnServer,
      ).toHaveBeenCalledWith("missing-obligation");

      await expect(response.json()).resolves.toEqual({
        error: "Reconciliation obligation not found.",
      });
    });

    it("returns a non-transitioned result without changing the activation result", async () => {
      const result: ResearchReconciliationObligationActivationResult = {
        obligation: {
          ...activationResult.obligation,
          status: "In Progress",
        },
        transitioned: false,
        reason:
          "Reconciliation obligation cannot be activated from status: In Progress.",
      };

      activateResearchReconciliationObligationOnServer.mockResolvedValue(
        result,
      );

      const response = await POST(createRequest(), {
        params: createParams("research-reconciliation-001"),
      });

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(result);
    });

    it("returns 500 for an unexpected activation failure", async () => {
      activateResearchReconciliationObligationOnServer.mockRejectedValue(
        new Error("unexpected activation failure"),
      );

      const response = await POST(createRequest(), {
        params: createParams("research-reconciliation-001"),
      });

      expect(response.status).toBe(500);

      await expect(response.json()).resolves.toEqual({
        error: "Research reconciliation obligation activation failed.",
      });
    });

    it("does not perform verification, recovery planning, execution, or resolution at the invocation boundary", async () => {
      activateResearchReconciliationObligationOnServer.mockResolvedValue(
        activationResult,
      );

      const response = await POST(createRequest(), {
        params: createParams("research-reconciliation-001"),
      });

      expect(response.status).toBe(200);
      expect(
        activateResearchReconciliationObligationOnServer,
      ).toHaveBeenCalledTimes(1);
      expect(
        activateResearchReconciliationObligationOnServer,
      ).toHaveBeenCalledWith("research-reconciliation-001");
    });
  },
);
