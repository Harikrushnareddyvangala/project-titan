import { describe, expect, it, vi } from "vitest";

vi.mock("../serverRepository", () => ({
  getResearchReconciliationObligation: vi.fn(),
}));

vi.mock("../../serverResearchSnapshot", () => ({
  loadServerResearchSnapshot: vi.fn(),
  createServerLineageService: vi.fn(),
}));

import type {
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRequest,
  ResearchReconciliationObligation,
} from "@/types/research";

import {
  confirmResearchReconciliationObligationRecoveryOnServer,
  type ResearchReconciliationObligationConfirmationDependencies,
} from "../confirmation";

const obligation: ResearchReconciliationObligation = {
  id: "research-reconciliation-001",
  investigationId: "investigation-001",
  issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
  targetEntityType: "Conclusion",
  targetEntityId: "conclusion-001",
  remediationAction: "RepairReference",
  provenanceEventId: "provenance-001",
  status: "In Progress",
  reason: "Committed remediation left an invalid conclusion finding reference.",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const issue: ResearchLineageIntegrityIssue = {
  code: "CONCLUSION_FINDING_REFERENCE_INVALID",
  message: "Conclusion references an invalid finding.",
  investigationId: obligation.investigationId,
  targetId: obligation.targetEntityId,
};

const snapshot = {
  getResearchInvestigations: [],
  getResearchExperiments: [],
  getResearchEvidence: [],
  getResearchFindings: [],
  getResearchFindingValidations: [],
  getResearchInvestigationConclusions: [],
  getResearchProvenanceEvents: [],
};

function createLineageService() {
  return {
    getResearchLineage: vi.fn(),
    validateResearchLineageForInvestigation: vi.fn().mockReturnValue({
      investigationId: obligation.investigationId,
      valid: false,
      issues: [issue],
    }),
  };
}

function createDependencies(
  overrides: Partial<ResearchReconciliationObligationConfirmationDependencies> = {},
): ResearchReconciliationObligationConfirmationDependencies {
  const lineageService = createLineageService();

  return {
    getResearchReconciliationObligation: vi
      .fn()
      .mockResolvedValue(obligation),
    loadServerResearchSnapshot: vi.fn().mockResolvedValue(snapshot),
    createServerLineageService: vi.fn().mockReturnValue(lineageService),
    createResearchLineageIntegrityRemediationRequest: vi.fn().mockReturnValue({
      investigationId: obligation.investigationId,
      action: "RepairReference",
      issueCode: obligation.issueCode,
      target: {
        targetId: obligation.targetEntityId,
      },
      confirmed: true,
    } satisfies ResearchLineageIntegrityRemediationRequest),
    createResearchLineageIntegrityRemediationPlan: vi.fn().mockReturnValue({
      investigationId: obligation.investigationId,
      action: "RepairReference",
      issueCode: obligation.issueCode,
      target: {
        targetId: obligation.targetEntityId,
      },
      confirmed: true,
      status: "Validated",
      description: "Confirmed recovery plan.",
    } satisfies ResearchLineageIntegrityRemediationPlan),
    ...overrides,
  };
}

describe("research reconciliation obligation recovery confirmation", () => {
  it("returns null when the persisted obligation does not exist", async () => {
    const dependencies = createDependencies({
      getResearchReconciliationObligation: vi.fn().mockResolvedValue(null),
    });

    const result =
      await confirmResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result).toBeNull();
    expect(dependencies.loadServerResearchSnapshot).not.toHaveBeenCalled();
  });

  it("does not confirm an obligation outside the In Progress lifecycle state", async () => {
    const nonConfirmableStatuses = [
      "Open",
      "Resolved",
      "Abandoned",
      "Superseded",
    ] as const;

    for (const status of nonConfirmableStatuses) {
      const dependencies = createDependencies({
        getResearchReconciliationObligation: vi
          .fn()
          .mockResolvedValue(obligation),
      });

      const persistedObligation = {
        ...obligation,
        status,
      };

      dependencies.getResearchReconciliationObligation = vi
        .fn()
        .mockResolvedValue(persistedObligation);

      const result =
        await confirmResearchReconciliationObligationRecoveryOnServer(
          obligation.id,
          dependencies,
        );

      expect(result).toEqual({
        obligationId: obligation.id,
        investigationId: obligation.investigationId,
        status: "NotAllowed",
        obligation: persistedObligation,
        reason:
          "Reconciliation obligation must be In Progress before recovery confirmation.",
      });

      expect(dependencies.loadServerResearchSnapshot).not.toHaveBeenCalled();
      expect(
        dependencies.createServerLineageService,
      ).not.toHaveBeenCalled();
      expect(
        dependencies.createResearchLineageIntegrityRemediationRequest,
      ).not.toHaveBeenCalled();
      expect(
        dependencies.createResearchLineageIntegrityRemediationPlan,
      ).not.toHaveBeenCalled();
    }
  });

  it("reports confirmation as unnecessary when the current issue is gone", async () => {
    const lineageService = createLineageService();
    lineageService.validateResearchLineageForInvestigation.mockReturnValue({
      investigationId: obligation.investigationId,
      valid: true,
      issues: [],
    });

    const dependencies = createDependencies({
      createServerLineageService: vi.fn().mockReturnValue(lineageService),
    });

    const result =
      await confirmResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result?.status).toBe("NotRequired");
    expect(result?.obligation).toEqual(obligation);
    expect(result?.issue).toBeUndefined();
    expect(
      dependencies.createResearchLineageIntegrityRemediationRequest,
    ).not.toHaveBeenCalled();
  });

  it("requires an exact current issue match", async () => {
    const unrelatedIssue: ResearchLineageIntegrityIssue = {
      ...issue,
      targetId: "different-target",
    };

    const lineageService = createLineageService();
    lineageService.validateResearchLineageForInvestigation.mockReturnValue({
      investigationId: obligation.investigationId,
      valid: false,
      issues: [unrelatedIssue],
    });

    const dependencies = createDependencies({
      createServerLineageService: vi.fn().mockReturnValue(lineageService),
    });

    const result =
      await confirmResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result?.status).toBe("NotRequired");
  });

  it("creates the remediation request with explicit confirmation", async () => {
    const dependencies = createDependencies();

    await confirmResearchReconciliationObligationRecoveryOnServer(
      obligation.id,
      dependencies,
    );

    expect(
      dependencies.createResearchLineageIntegrityRemediationRequest,
    ).toHaveBeenCalledWith(
      obligation.investigationId,
      issue,
      true,
      undefined,
      true,
    );
  });

  it("creates a validated confirmed plan", async () => {
    const dependencies = createDependencies();

    const result =
      await confirmResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result?.status).toBe("Validated");
    expect(result?.request?.confirmed).toBe(true);
    expect(result?.plan?.confirmed).toBe(true);
    expect(result?.plan?.status).toBe("Validated");
  });

  it("passes fresh server state to the existing remediation planner", async () => {
    const dependencies = createDependencies();

    await confirmResearchReconciliationObligationRecoveryOnServer(
      obligation.id,
      dependencies,
    );

    expect(
      dependencies.createResearchLineageIntegrityRemediationPlan,
    ).toHaveBeenCalledTimes(1);

    const [, planningDependencies] = (
      dependencies.createResearchLineageIntegrityRemediationPlan as ReturnType<
        typeof vi.fn
      >
    ).mock.calls[0];

    expect(planningDependencies.getResearchLineage).toBeTypeOf("function");
    expect(planningDependencies.getResearchInvestigations()).toBe(
      snapshot.getResearchInvestigations,
    );
    expect(planningDependencies.getResearchFindings()).toBe(
      snapshot.getResearchFindings,
    );
    expect(planningDependencies.getResearchInvestigationConclusions()).toBe(
      snapshot.getResearchInvestigationConclusions,
    );
  });

  it("does not mutate the obligation during confirmation", async () => {
    const dependencies = createDependencies();

    const result =
      await confirmResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result?.obligation).toEqual(obligation);
    expect(result?.obligation.status).toBe("In Progress");
  });
});
