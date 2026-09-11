import { describe, expect, it, vi } from "vitest";

import type {
  ResearchReconciliationObligation,
  ResearchReconciliationObligationStatus,
} from "@/types/research";

import type { ResearchReconciliationObligationVerificationResult } from "../verification";
import {
  transitionResearchReconciliationObligationAfterVerification,
} from "../lifecycle";

function createObligation(
  overrides: Partial<ResearchReconciliationObligation> = {},
): ResearchReconciliationObligation {
  return {
    id: "reconciliation-001",
    investigationId: "investigation-001",
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    targetEntityType: "Conclusion",
    targetEntityId: "conclusion-001",
    remediationAction: "RepairReference",
    status: "In Progress",
    reason: "Postcondition validation remained invalid.",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:05:00.000Z",
    ...overrides,
  };
}

function createVerification(
  overrides: Partial<ResearchReconciliationObligationVerificationResult> = {},
): ResearchReconciliationObligationVerificationResult {
  return {
    obligationId: "reconciliation-001",
    investigationId: "investigation-001",
    verified: true,
    unresolved: false,
    matchingIssueCount: 0,
    matchingIssues: [],
    ...overrides,
  };
}

describe("research reconciliation obligation lifecycle boundary", () => {
  it("transitions an in-progress obligation to resolved after successful verification", async () => {
    const updateStatus = vi.fn().mockResolvedValue(
      createObligation({
        status: "Resolved",
        updatedAt: "2026-01-01T00:10:00.000Z",
        resolvedAt: "2026-01-01T00:10:00.000Z",
      }),
    );

    const result =
      await transitionResearchReconciliationObligationAfterVerification(
        createObligation(),
        createVerification(),
        {
          updateResearchReconciliationObligationStatus: updateStatus,
          now: () => "2026-01-01T00:10:00.000Z",
        },
      );

    expect(updateStatus).toHaveBeenCalledWith("reconciliation-001", {
      expectedUpdatedAt: "2026-01-01T00:05:00.000Z",
      toStatus: "Resolved",
      updatedAt: "2026-01-01T00:10:00.000Z",
    });
    expect(result.obligation.status).toBe("Resolved");
  });

  it("does not mutate an obligation when verification is unsuccessful", async () => {
    const updateStatus = vi.fn();

    const result =
      await transitionResearchReconciliationObligationAfterVerification(
        createObligation(),
        createVerification({
          verified: false,
          unresolved: true,
          matchingIssueCount: 1,
        }),
        {
          updateResearchReconciliationObligationStatus: updateStatus,
          now: () => "2026-01-01T00:10:00.000Z",
        },
      );

    expect(updateStatus).not.toHaveBeenCalled();
    expect(result).toEqual({
      obligation: createObligation(),
      transitioned: false,
      reason: "Reconciliation obligation remains unresolved.",
    });
  });

  it("does not mutate an open obligation directly to resolved", async () => {
    const updateStatus = vi.fn();

    const result =
      await transitionResearchReconciliationObligationAfterVerification(
        createObligation({ status: "Open" }),
        createVerification(),
        {
          updateResearchReconciliationObligationStatus: updateStatus,
          now: () => "2026-01-01T00:10:00.000Z",
        },
      );

    expect(updateStatus).not.toHaveBeenCalled();
    expect(result).toEqual({
      obligation: createObligation({ status: "Open" }),
      transitioned: false,
      reason:
        "Reconciliation obligation cannot transition directly from Open to Resolved.",
    });
  });

  it("rejects a verification result for another obligation", async () => {
    const updateStatus = vi.fn();

    await expect(
      transitionResearchReconciliationObligationAfterVerification(
        createObligation(),
        createVerification({
          obligationId: "reconciliation-002",
        }),
        {
          updateResearchReconciliationObligationStatus: updateStatus,
          now: () => "2026-01-01T00:10:00.000Z",
        },
      ),
    ).rejects.toThrow(
      "Reconciliation obligation verification does not belong to the obligation.",
    );

    expect(updateStatus).not.toHaveBeenCalled();
  });

  it("rejects a verification result for another investigation", async () => {
    const updateStatus = vi.fn();

    await expect(
      transitionResearchReconciliationObligationAfterVerification(
        createObligation(),
        createVerification({
          investigationId: "investigation-002",
        }),
        {
          updateResearchReconciliationObligationStatus: updateStatus,
          now: () => "2026-01-01T00:10:00.000Z",
        },
      ),
    ).rejects.toThrow(
      "Reconciliation obligation verification does not belong to the obligation.",
    );

    expect(updateStatus).not.toHaveBeenCalled();
  });

  it("does not transition an already terminal obligation", async () => {
    const terminalStatuses: ResearchReconciliationObligationStatus[] = [
      "Resolved",
      "Abandoned",
      "Superseded",
    ];

    for (const status of terminalStatuses) {
      const updateStatus = vi.fn();

      const result =
        await transitionResearchReconciliationObligationAfterVerification(
          createObligation({ status }),
          createVerification(),
          {
            updateResearchReconciliationObligationStatus: updateStatus,
            now: () => "2026-01-01T00:10:00.000Z",
          },
        );

      expect(updateStatus).not.toHaveBeenCalled();
      expect(result).toEqual({
        obligation: createObligation({ status }),
        transitioned: false,
        reason: `Reconciliation obligation is already terminal: ${status}.`,
      });
    }
  });
});
