import { describe, expect, it, vi } from "vitest";

import type {
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRequest,
  ResearchReconciliationObligation,
} from "@/types/research";

import {
  planResearchReconciliationObligationRecoveryOnServer,
  type ResearchReconciliationObligationRecoveryPlanningDependencies,
} from "../recoveryPlanning";

vi.mock("../serverRepository", () => ({
  getResearchReconciliationObligation: vi.fn(),
}));

vi.mock("../../serverResearchSnapshot", () => ({
  loadServerResearchSnapshot: vi.fn(),
  createServerLineageService: vi.fn(),
}));

const obligation: ResearchReconciliationObligation = {
  id: "research-reconciliation-001",
  investigationId: "investigation-001",
  issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
  targetEntityType: "Conclusion",
  targetEntityId: "conclusion-001",
  remediationAction: "RepairReference",
  provenanceEventId: "provenance-001",
  status: "Open",
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

const integrityResult = {
  investigationId: obligation.investigationId,
  valid: false,
  issues: [issue],
};

function createLineageService() {
  return {
    getResearchLineage: vi.fn(),
    validateResearchLineage: vi.fn(),
    validateResearchLineageForInvestigation: vi
      .fn()
      .mockReturnValue(integrityResult),
  };
}

function createDependencies(
  overrides: Partial<ResearchReconciliationObligationRecoveryPlanningDependencies> = {},
): ResearchReconciliationObligationRecoveryPlanningDependencies {
  const lineageService = createLineageService();

  return {
    getResearchReconciliationObligation: vi
      .fn()
      .mockResolvedValue(obligation),
    loadServerResearchSnapshot: vi.fn().mockResolvedValue(snapshot),
    createServerLineageService: vi.fn().mockReturnValue(lineageService),
    createResearchLineageIntegrityRemediationRequest: vi
      .fn()
      .mockReturnValue({
        investigationId: obligation.investigationId,
        action: "RepairReference",
        issueCode: obligation.issueCode,
        target: {
          targetId: obligation.targetEntityId,
        },
        confirmed: false,
      } satisfies ResearchLineageIntegrityRemediationRequest),
    createResearchLineageIntegrityRemediationPlan: vi
      .fn()
      .mockReturnValue({
        investigationId: obligation.investigationId,
        action: "RepairReference",
        issueCode: obligation.issueCode,
        target: {
          targetId: obligation.targetEntityId,
        },
        confirmed: false,
        status: "Planned",
        description: "Fresh recovery plan.",
      } satisfies ResearchLineageIntegrityRemediationPlan),
    ...overrides,
  };
}

describe("research reconciliation obligation recovery planning", () => {
  it("returns null when the persisted obligation does not exist", async () => {
    const dependencies = createDependencies({
      getResearchReconciliationObligation: vi.fn().mockResolvedValue(null),
    });

    const result =
      await planResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result).toBeNull();
    expect(dependencies.loadServerResearchSnapshot).not.toHaveBeenCalled();
    expect(dependencies.createServerLineageService).not.toHaveBeenCalled();
  });

  it("reports recovery as unnecessary when the current issue is gone", async () => {
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
      await planResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result?.status).toBe("NotRequired");
    expect(result?.obligation).toEqual(obligation);
    expect(result?.issue).toBeUndefined();
    expect(
      dependencies.createResearchLineageIntegrityRemediationRequest,
    ).not.toHaveBeenCalled();
    expect(
      dependencies.createResearchLineageIntegrityRemediationPlan,
    ).not.toHaveBeenCalled();
  });

  it("matches the current issue using investigation, issue code, and target identity", async () => {
    const unrelatedIssue: ResearchLineageIntegrityIssue = {
      ...issue,
      targetId: "different-target",
    };

    const lineageService = createLineageService();
    lineageService.validateResearchLineageForInvestigation.mockReturnValue({
      investigationId: obligation.investigationId,
      valid: false,
      issues: [unrelatedIssue, issue],
    });

    const dependencies = createDependencies({
      createServerLineageService: vi.fn().mockReturnValue(lineageService),
    });

    const result =
      await planResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result?.status).toBe("Planned");
    expect(result?.issue).toEqual(issue);
  });

  it("derives recovery from the current issue rather than the historical obligation action", async () => {
    const dependencies = createDependencies({
      getResearchReconciliationObligation: vi.fn().mockResolvedValue({
        ...obligation,
        remediationAction: "RepairRelationship",
      }),
    });

    const result =
      await planResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result?.status).toBe("Planned");
    expect(
      dependencies.createResearchLineageIntegrityRemediationRequest,
    ).toHaveBeenCalledWith(
      obligation.investigationId,
      issue,
      false,
      undefined,
      false,
    );
  });

  it("creates an unconfirmed recovery plan", async () => {
    const dependencies = createDependencies();

    const result =
      await planResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result?.status).toBe("Planned");
    expect(result?.request?.confirmed).toBe(false);
    expect(result?.plan?.confirmed).toBe(false);
    expect(result?.plan?.status).toBe("Planned");
  });

  it("passes fresh lineage and research state to the existing remediation planner", async () => {
    const dependencies = createDependencies();

    await planResearchReconciliationObligationRecoveryOnServer(
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
    expect(planningDependencies.getResearchExperiments()).toBe(
      snapshot.getResearchExperiments,
    );
    expect(planningDependencies.getResearchEvidence()).toBe(
      snapshot.getResearchEvidence,
    );
    expect(planningDependencies.getResearchFindings()).toBe(
      snapshot.getResearchFindings,
    );
    expect(planningDependencies.getResearchFindingValidations()).toBe(
      snapshot.getResearchFindingValidations,
    );
    expect(planningDependencies.getResearchInvestigationConclusions()).toBe(
      snapshot.getResearchInvestigationConclusions,
    );
  });

  it("does not mutate the obligation while planning recovery", async () => {
    const dependencies = createDependencies();

    const result =
      await planResearchReconciliationObligationRecoveryOnServer(
        obligation.id,
        dependencies,
      );

    expect(result?.status).toBe("Planned");
    expect(result?.obligation).toEqual(obligation);
  });
});
