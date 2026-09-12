import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ResearchReconciliationObligationConfirmationResult } from "@/lib/research/reconciliationObligation/confirmation";

const { confirmResearchReconciliationObligationRecoveryOnServer } = vi.hoisted(
  () => ({
    confirmResearchReconciliationObligationRecoveryOnServer: vi.fn(),
  }),
);

vi.mock(
  "@/lib/research/reconciliationObligation/confirmation",
  () => ({
    confirmResearchReconciliationObligationRecoveryOnServer,
  }),
);

import { POST } from "./route";

const confirmationResult: ResearchReconciliationObligationConfirmationResult =
  {
    obligationId: "research-reconciliation-001",
    investigationId: "investigation-001",
    status: "Validated",
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
      confirmed: true,
    },
    plan: {
      investigationId: "investigation-001",
      action: "RepairReference",
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      target: {
        targetId: "conclusion-001",
      },
      confirmed: true,
      status: "Validated",
      description: "Confirmed recovery plan.",
    },
    reason:
      "The current integrity issue remains unresolved and an explicitly confirmed remediation plan has been prepared.",
  };

function createRequest(obligationId = "research-reconciliation-001") {
  return new Request(
    `http://localhost/api/research/reconciliation/obligations/${obligationId}/confirm`,
    {
      method: "POST",
    },
  );
}

function createParams(obligationId: string) {
  return Promise.resolve({ obligationId });
}

describe(
  "POST /api/research/reconciliation/obligations/[obligationId]/confirm",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("confirms recovery through the server boundary", async () => {
      confirmResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
        confirmationResult,
      );

      const response = await POST(createRequest(), {
        params: createParams("research-reconciliation-001"),
      });

      expect(response.status).toBe(200);
      expect(
        confirmResearchReconciliationObligationRecoveryOnServer,
      ).toHaveBeenCalledTimes(1);
      expect(
        confirmResearchReconciliationObligationRecoveryOnServer,
      ).toHaveBeenCalledWith("research-reconciliation-001");

      await expect(response.json()).resolves.toEqual(confirmationResult);
    });

    it("returns 400 for an empty obligation id", async () => {
      const response = await POST(createRequest(""), {
        params: createParams(""),
      });

      expect(response.status).toBe(400);
      expect(
        confirmResearchReconciliationObligationRecoveryOnServer,
      ).not.toHaveBeenCalled();

      await expect(response.json()).resolves.toEqual({
        error: "Invalid reconciliation obligation.",
      });
    });

    it("returns 404 when the reconciliation obligation does not exist", async () => {
      confirmResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
        null,
      );

      const response = await POST(createRequest("missing-obligation"), {
        params: createParams("missing-obligation"),
      });

      expect(response.status).toBe(404);
      expect(
        confirmResearchReconciliationObligationRecoveryOnServer,
      ).toHaveBeenCalledWith("missing-obligation");

      await expect(response.json()).resolves.toEqual({
        error: "Reconciliation obligation not found.",
      });
    });

    it("returns NotAllowed without changing the confirmation result", async () => {
      const result: ResearchReconciliationObligationConfirmationResult = {
        ...confirmationResult,
        status: "NotAllowed",
        request: undefined,
        plan: undefined,
        reason:
          "Reconciliation obligation must be In Progress before recovery confirmation.",
      };

      confirmResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
        result,
      );

      const response = await POST(createRequest(), {
        params: createParams("research-reconciliation-001"),
      });

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(result);
    });

    it("returns NotRequired without changing the confirmation result", async () => {
      const result: ResearchReconciliationObligationConfirmationResult = {
        ...confirmationResult,
        status: "NotRequired",
        issue: undefined,
        request: undefined,
        plan: undefined,
        reason:
          "The integrity condition represented by the reconciliation obligation is no longer present.",
      };

      confirmResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
        result,
      );

      const response = await POST(createRequest(), {
        params: createParams("research-reconciliation-001"),
      });

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(result);
    });

    it("returns NotRepairable without changing the confirmation result", async () => {
      const result: ResearchReconciliationObligationConfirmationResult = {
        ...confirmationResult,
        status: "NotRepairable",
        request: undefined,
        plan: undefined,
        reason:
          "The current integrity issue does not produce an executable remediation request.",
      };

      confirmResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
        result,
      );

      const response = await POST(createRequest(), {
        params: createParams("research-reconciliation-001"),
      });

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(result);
    });

    it("returns 500 for an unexpected confirmation failure", async () => {
      confirmResearchReconciliationObligationRecoveryOnServer.mockRejectedValue(
        new Error("unexpected confirmation failure"),
      );

      const response = await POST(createRequest(), {
        params: createParams("research-reconciliation-001"),
      });

      expect(response.status).toBe(500);

      await expect(response.json()).resolves.toEqual({
        error: "Research reconciliation recovery confirmation failed.",
      });
    });

    it("does not execute or resolve the obligation at the invocation boundary", async () => {
      confirmResearchReconciliationObligationRecoveryOnServer.mockResolvedValue(
        confirmationResult,
      );

      const response = await POST(createRequest(), {
        params: createParams("research-reconciliation-001"),
      });

      expect(response.status).toBe(200);
      expect(
        confirmResearchReconciliationObligationRecoveryOnServer,
      ).toHaveBeenCalledTimes(1);
      expect(
        confirmResearchReconciliationObligationRecoveryOnServer,
      ).toHaveBeenCalledWith("research-reconciliation-001");
    });
  },
);
