import { describe, expect, it, vi } from "vitest";

import type {
  ResearchFinding,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRepairDecisionResult,
  ResearchLineageIntegrityResolvedRemediationTarget,
} from "@/types/research";

import {
  createResearchLineageIntegrityRemediationMutationContract,
  decideResearchLineageIntegrityRemediationRepair,
  discoverResearchLineageIntegrityRemediationReplacement,
  executeResearchLineageIntegrityRemediationRepair,
  type ResearchLineageRemediationRepairDependencies,
} from "../repair";

const INVESTIGATION_ID = "investigation-001";
const CONCLUSION_ID = "conclusion-001";
const SOURCE_FINDING_ID = "finding-invalid";
const REPLACEMENT_FINDING_ID = "finding-valid";

function createInvestigation(
  findingIds: string[] = [REPLACEMENT_FINDING_ID],
): ResearchInvestigation {
  return {
    id: INVESTIGATION_ID,
    title: "Investigation",
    objective: "Understand the system",
    question: "Why?",
    status: "Draft",
    experimentIds: [],
    evidenceIds: [],
    findingIds,
    artifactIds: [],
    conclusionIds: [CONCLUSION_ID],
    createdAt: "2026-08-30T00:00:00.000Z",
    updatedAt: "2026-08-30T00:00:00.000Z",
  };
}

function createFinding(id: string, statement = `Finding ${id}`): ResearchFinding {
  return {
    id,
    statement,
  } as ResearchFinding;
}

function createConclusion(
  supportingFindingIds: string[] = [SOURCE_FINDING_ID],
  contradictingFindingIds: string[] = [],
): ResearchInvestigationConclusion {
  return {
    id: CONCLUSION_ID,
    investigationId: INVESTIGATION_ID,
    supportingFindingIds,
    contradictingFindingIds,
  } as ResearchInvestigationConclusion;
}

function createPlan(
  overrides: Partial<ResearchLineageIntegrityRemediationPlan> = {},
): ResearchLineageIntegrityRemediationPlan {
  return {
    investigationId: INVESTIGATION_ID,
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    action: "RepairReference",
    target: {
      entityId: CONCLUSION_ID,
      sourceId: SOURCE_FINDING_ID,
    },
    ...overrides,
  } as ResearchLineageIntegrityRemediationPlan;
}

function createResolvedTarget(): ResearchLineageIntegrityResolvedRemediationTarget {
  return {
    investigationId: INVESTIGATION_ID,
    resolvable: true,
    kind: "Conclusion",
    entityId: CONCLUSION_ID,
    sourceId: SOURCE_FINDING_ID,
    reason: "Resolved for deterministic repair.",
  };
}

function createDependencies(
  overrides: Partial<ResearchLineageRemediationRepairDependencies> = {},
): ResearchLineageRemediationRepairDependencies {
  return {
    getResearchInvestigations: () => [createInvestigation()],
    getResearchFindings: () => [createFinding(REPLACEMENT_FINDING_ID)],
    getResearchInvestigationConclusions: () => [
      createConclusion(),
    ],
    resolveResearchLineageIntegrityRemediationTarget: () =>
      createResolvedTarget(),
    saveResearchInvestigationConclusion: vi.fn(),
    createResearchProvenanceEvent: vi.fn(() => ({
      id: "event-001",
    })),
    validateResearchLineage: vi.fn(() => ({
      investigationId: INVESTIGATION_ID,
      valid: true,
      issueCount: 0,
      issues: [],
      checkedNodeCount: 3,
      checkedEdgeCount: 2,
    })),
    ...overrides,
  };
}

function createRepairableDecision(
  overrides: Partial<
    ResearchLineageIntegrityRemediationRepairDecisionResult
  > = {},
): ResearchLineageIntegrityRemediationRepairDecisionResult {
  return {
    investigationId: INVESTIGATION_ID,
    action: "RepairReference",
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    decision: "Repairable",
    resolvedTarget: createResolvedTarget(),
    replacementEntityId: REPLACEMENT_FINDING_ID,
    repairDescription: "Deterministic replacement.",
    reason: "Exactly one replacement was selected.",
    ...overrides,
  };
}

describe("research lineage remediation repair", () => {
  describe("replacement discovery", () => {
    it("returns NotFound when the investigation does not exist", () => {
      const result = discoverResearchLineageIntegrityRemediationReplacement(
        createPlan(),
        createDependencies({
          getResearchInvestigations: () => [],
        }),
      );

      expect(result.status).toBe("NotFound");
      expect(result.candidates).toEqual([]);
      expect(result.selectedCandidate).toBeNull();
    });

    it("returns NotFound for an unsupported issue code", () => {
      const result = discoverResearchLineageIntegrityRemediationReplacement(
        createPlan({
          issueCode: "SOURCE_NODE_NOT_FOUND",
        }),
        createDependencies(),
      );

      expect(result.status).toBe("NotFound");
      expect(result.selectedCandidate).toBeNull();
    });

    it("returns Ambiguous when multiple in-scope findings are available", () => {
      const result = discoverResearchLineageIntegrityRemediationReplacement(
        createPlan(),
        createDependencies({
          getResearchFindings: () => [
            createFinding("finding-001"),
            createFinding("finding-002"),
          ],
          getResearchInvestigations: () =>
            [createInvestigation(["finding-001", "finding-002"])],
        }),
      );

      expect(result.status).toBe("Ambiguous");
      expect(result.candidates).toHaveLength(2);
      expect(result.selectedCandidate).toBeNull();
    });

    it("resolves exactly one in-scope replacement finding", () => {
      const result = discoverResearchLineageIntegrityRemediationReplacement(
        createPlan(),
        createDependencies(),
      );

      expect(result.status).toBe("Resolved");
      expect(result.candidates).toHaveLength(1);
      expect(result.selectedCandidate?.id).toBe(REPLACEMENT_FINDING_ID);
      expect(result.selectedCandidate?.investigationId).toBe(
        INVESTIGATION_ID,
      );
    });

    it("resolves an explicit replacement finding by exact ID", () => {
      const result = discoverResearchLineageIntegrityRemediationReplacement(
        createPlan({
          replacementEntityId: REPLACEMENT_FINDING_ID,
        }),
        createDependencies(),
      );

      expect(result.status).toBe("Resolved");
      expect(result.candidates).toHaveLength(1);
      expect(result.selectedCandidate?.id).toBe(REPLACEMENT_FINDING_ID);
    });
  });

  describe("repair decision and mutation contract", () => {
    it("rejects a repair when the target cannot be resolved", () => {
      const result = decideResearchLineageIntegrityRemediationRepair(
        createPlan(),
        createDependencies({
          resolveResearchLineageIntegrityRemediationTarget: () =>
            ({
              ...createResolvedTarget(),
              resolvable: false,
              reason: "Target could not be resolved.",
            }) as ResearchLineageIntegrityResolvedRemediationTarget,
        }),
      );

      expect(result.decision).toBe("NotRepairable");
      expect(result.replacementEntityId).toBeUndefined();
    });

    it("rejects non-reference remediation actions", () => {
      const result = decideResearchLineageIntegrityRemediationRepair(
        createPlan({
          action: "RepairScope",
        }),
        createDependencies(),
      );

      expect(result.decision).toBe("NotRepairable");
    });

    it("creates a deterministic reference-replacement contract", () => {
      const contract =
        createResearchLineageIntegrityRemediationMutationContract(
          createRepairableDecision(),
        );

      expect(contract).toEqual({
        mutationType: "ReferenceReplacement",
        investigationId: INVESTIGATION_ID,
        action: "RepairReference",
        issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
        target: createResolvedTarget(),
        replacementEntityId: REPLACEMENT_FINDING_ID,
        deterministic: true,
        requiresConfirmation: true,
        createsProvenanceEvent: true,
        description:
          "Apply only the deterministic reference replacement defined by the repair decision.",
      });
    });

    it("does not create a contract for a non-repairable decision", () => {
      expect(
        createResearchLineageIntegrityRemediationMutationContract(
          createRepairableDecision({
            decision: "NotRepairable",
          }),
        ),
      ).toBeNull();
    });
  });

  describe("repair execution", () => {
    it("rejects a non-repairable decision without mutating state", () => {
      const dependencies = createDependencies();

      const result = executeResearchLineageIntegrityRemediationRepair(
        createRepairableDecision({
          decision: "NotRepairable",
        }),
        dependencies,
      );

      expect(result.executed).toBe(false);
      expect(dependencies.saveResearchInvestigationConclusion).not.toHaveBeenCalled();
      expect(dependencies.createResearchProvenanceEvent).not.toHaveBeenCalled();
    });

    it("rejects a replacement finding outside the investigation", () => {
      const dependencies = createDependencies({
        getResearchInvestigations: () => [
          createInvestigation(["another-finding"]),
        ],
      });

      const result = executeResearchLineageIntegrityRemediationRepair(
        createRepairableDecision(),
        dependencies,
      );

      expect(result.executed).toBe(false);
      expect(result.message).toContain(
        "replacement finding does not belong to the investigation",
      );
    });

    it("replaces a supporting finding reference and records provenance", () => {
      const saveResearchInvestigationConclusion = vi.fn();
      const createResearchProvenanceEvent = vi.fn(() => ({
        id: "event-001",
      }));
      const validateResearchLineage = vi.fn(() => ({
        investigationId: INVESTIGATION_ID,
        valid: true,
        issueCount: 0,
        issues: [],
        checkedNodeCount: 3,
        checkedEdgeCount: 2,
      }));

      const dependencies = createDependencies({
        saveResearchInvestigationConclusion,
        createResearchProvenanceEvent,
        validateResearchLineage,
      });

      const result = executeResearchLineageIntegrityRemediationRepair(
        createRepairableDecision(),
        dependencies,
      );

      expect(result.executed).toBe(true);
      expect(result.mutationType).toBe("ReferenceReplacement");
      expect(result.provenanceEventId).toBe("event-001");
      expect(result.postcondition).toMatchObject({
        validated: true,
        valid: true,
        issueCount: 0,
      });

      expect(saveResearchInvestigationConclusion).toHaveBeenCalledWith(
        expect.objectContaining({
          id: CONCLUSION_ID,
          supportingFindingIds: [REPLACEMENT_FINDING_ID],
          contradictingFindingIds: [],
        }),
      );

      expect(createResearchProvenanceEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          investigationId: INVESTIGATION_ID,
          entityType: "Conclusion",
          entityId: CONCLUSION_ID,
          eventType: "Updated",
        }),
      );

      expect(validateResearchLineage).toHaveBeenCalledWith(
        INVESTIGATION_ID,
      );
    });

    it("replaces a contradicting finding reference", () => {
      const saveResearchInvestigationConclusion = vi.fn();

      const dependencies = createDependencies({
        getResearchInvestigationConclusions: () => [
          createConclusion([], [SOURCE_FINDING_ID]),
        ],
        saveResearchInvestigationConclusion,
      });

      const result = executeResearchLineageIntegrityRemediationRepair(
        createRepairableDecision(),
        dependencies,
      );

      expect(result.executed).toBe(true);
      expect(saveResearchInvestigationConclusion).toHaveBeenCalledWith(
        expect.objectContaining({
          supportingFindingIds: [],
          contradictingFindingIds: [REPLACEMENT_FINDING_ID],
        }),
      );
    });

    it("rejects a replacement already referenced by the conclusion", () => {
      const dependencies = createDependencies({
        getResearchInvestigationConclusions: () => [
          createConclusion([SOURCE_FINDING_ID, REPLACEMENT_FINDING_ID]),
        ],
      });

      const result = executeResearchLineageIntegrityRemediationRepair(
        createRepairableDecision(),
        dependencies,
      );

      expect(result.executed).toBe(false);
      expect(result.message).toContain(
        "replacement finding is already referenced",
      );
    });

    it("reports a failed postcondition when the invalid reference remains", () => {
      const dependencies = createDependencies({
        validateResearchLineage: vi.fn(() => ({
          investigationId: INVESTIGATION_ID,
          valid: false,
          issueCount: 1,
          issues: [
            {
              investigationId: INVESTIGATION_ID,
              code: "CONCLUSION_FINDING_REFERENCE_INVALID",
              message: "Reference remains invalid.",
              targetId: CONCLUSION_ID,
            },
          ],
          checkedNodeCount: 3,
          checkedEdgeCount: 2,
        })),
      });

      const result = executeResearchLineageIntegrityRemediationRepair(
        createRepairableDecision(),
        dependencies,
      );

      expect(result.executed).toBe(false);
      expect(result.provenanceEventId).toBe("event-001");
      expect(result.postcondition?.valid).toBe(false);
      expect(result.message).toContain(
        "lineage validation still reports an invalid conclusion finding reference",
      );
    });
  });
});
