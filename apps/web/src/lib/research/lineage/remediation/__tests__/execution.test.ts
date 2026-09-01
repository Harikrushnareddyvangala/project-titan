import { describe, expect, it, vi } from "vitest";

import type {
  ResearchLineageIntegrityRemediationExecutionPolicy,
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRepairDecisionResult,
  ResearchLineageIntegrityRemediationRepairExecutionResult,
  ResearchLineageIntegrityRemediationTargetValidation,
  ResearchLineageIntegrityResolvedRemediationTarget,
  ResearchFinding,
} from "@/types/research";

import {
  createResearchLineageRemediationExecutionService,
  type ResearchLineageRemediationExecutionDependencies,
} from "../execution";

const INVESTIGATION_ID = "investigation-001";
const FINDING_ID = "finding-001";

function createPlan(
  overrides: Partial<ResearchLineageIntegrityRemediationPlan> = {},
): ResearchLineageIntegrityRemediationPlan {
  return {
    investigationId: INVESTIGATION_ID,
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    action: "RepairReference",
    target: {
      entityId: "conclusion-001",
      sourceId: FINDING_ID,
    },
    confirmed: true,
    ...overrides,
  } as ResearchLineageIntegrityRemediationPlan;
}

function createResolvedTarget(): ResearchLineageIntegrityResolvedRemediationTarget {
  return {
    investigationId: INVESTIGATION_ID,
    resolvable: true,
    kind: "Conclusion",
    entityId: "conclusion-001",
    sourceId: FINDING_ID,
    reason: "Resolved for deterministic repair.",
  };
}

function createDependencies(
  overrides: Partial<ResearchLineageRemediationExecutionDependencies> = {},
): ResearchLineageRemediationExecutionDependencies {
  const policy: ResearchLineageIntegrityRemediationExecutionPolicy = {
    action: "RepairReference",
    requiresConfirmation: true,
    mutatesResearchData: true,
    createsProvenanceEvent: true,
    requiresTargetValidation: true,
  };

  const targetValidation: ResearchLineageIntegrityRemediationTargetValidation = {
    valid: true,
    investigationId: INVESTIGATION_ID,
    target: {
      nodeId: "conclusion-001",
      sourceId: FINDING_ID,
    },
    reason: "Target is valid.",
  };

  const replacement: ResearchFinding = {
    id: "finding-replacement",
    statement: "Replacement finding",
  } as ResearchFinding;

  const repairDecision: ResearchLineageIntegrityRemediationRepairDecisionResult =
    {
      investigationId: INVESTIGATION_ID,
      action: "RepairReference",
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      decision: "Repairable",
      resolvedTarget: createResolvedTarget(),
      replacementEntityId: replacement.id,
      repairDescription: "Deterministic replacement.",
      reason: "Exactly one replacement was selected.",
    };

  const repairExecution: ResearchLineageIntegrityRemediationRepairExecutionResult =
    {
      investigationId: INVESTIGATION_ID,
      action: "RepairReference",
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      mutationType: "ReferenceReplacement",
      executed: true,
      message: "Repair completed.",
      provenanceEventId: "event-001",
      postcondition: {
        validated: true,
        valid: true,
        issueCount: 0,
        issues: [],
        checkedNodeCount: 3,
        checkedEdgeCount: 2,
      },
    };

  return {
    getResearchLineageIntegrityRemediationExecutionPolicy: () =>
      policy,

    validateResearchLineageIntegrityRemediationTarget: () =>
      targetValidation,

    resolveResearchLineageIntegrityRemediationTarget: () =>
      createResolvedTarget(),

    getResearchLineageRemediationEntityUpdatedAt: () =>
      "2026-01-01T00:00:00.000Z",

    getResearchLineageRemediationReplacement: () =>
      replacement,

    decideResearchLineageIntegrityRemediationRepair: vi.fn(
      () => repairDecision,
    ),

    executeResearchLineageIntegrityRemediationRepair: vi.fn(
      () => repairExecution,
    ),

    ...overrides,
  };
}

describe("research lineage remediation execution", () => {
  it("exposes execution operations through the service factory", () => {
    const dependencies = createDependencies();
    const service =
      createResearchLineageRemediationExecutionService(
        dependencies,
      );

    const plan = createPlan();

    const preflight =
      service.preflightResearchLineageIntegrityRemediation(
        plan,
      );

    expect(preflight.ready).toBe(true);
    expect(preflight.confirmed).toBe(true);

    const result =
      service.executeResearchLineageIntegrityRemediation(
        plan,
      );

    expect(result.executed).toBe(true);
    expect(result.status).toBe("Executed");
    expect(result.provenanceEventId).toBe("event-001");

    expect(
      dependencies.decideResearchLineageIntegrityRemediationRepair,
    ).toHaveBeenCalledWith(plan);

    expect(
      dependencies.executeResearchLineageIntegrityRemediationRepair,
    ).toHaveBeenCalled();
  });

  it("preserves rejection through the service factory when confirmation is missing", () => {
    const dependencies = createDependencies();
    const service =
      createResearchLineageRemediationExecutionService(
        dependencies,
      );

    const result =
      service.executeResearchLineageIntegrityRemediation(
        createPlan({
          confirmed: false,
        }),
      );

    expect(result.status).toBe("Rejected");
    expect(result.executed).toBe(false);
    expect(result.message).toBe(
      "Remediation execution requires explicit confirmation.",
    );

    expect(
      dependencies.decideResearchLineageIntegrityRemediationRepair,
    ).not.toHaveBeenCalled();
  });
});
