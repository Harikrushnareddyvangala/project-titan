import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ResearchFinding,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchLineageIntegrityRemediationPlan,
} from "@/types/research";

const {
  getResearchInvestigations,
  getResearchExperiments,
  getResearchEvidence,
  getResearchFindings,
  getResearchFindingValidations,
  getResearchInvestigationConclusions,
  getResearchProvenanceEvents,
  persistResearchLineageRemediationMutation,
  createResearchReconciliationObligationRecord,
} = vi.hoisted(() => ({
  getResearchInvestigations: vi.fn(),
  getResearchExperiments: vi.fn(),
  getResearchEvidence: vi.fn(),
  getResearchFindings: vi.fn(),
  getResearchFindingValidations: vi.fn(),
  getResearchInvestigationConclusions: vi.fn(),
  getResearchProvenanceEvents: vi.fn(),
  persistResearchLineageRemediationMutation: vi.fn(),
  createResearchReconciliationObligationRecord: vi.fn(),
}));

vi.mock("@/lib/research/serverRepository", () => ({
  getResearchInvestigations,
  getResearchExperiments,
  getResearchEvidence,
  getResearchFindings,
  getResearchFindingValidations,
  getResearchInvestigationConclusions,
  getResearchProvenanceEvents,
}));

vi.mock("@titan/database", () => ({
  persistResearchLineageRemediationMutation,
  createResearchReconciliationObligationRecord,
}));

import { executeResearchLineageIntegrityRemediationOnServer } from "../serverExecutor";

const INVESTIGATION_ID = "investigation-001";
const CONCLUSION_ID = "conclusion-001";
const SOURCE_FINDING_ID = "finding-invalid";
const REPLACEMENT_FINDING_ID = "finding-valid";

function createInvestigation(): ResearchInvestigation {
  return {
    id: INVESTIGATION_ID,
    title: "Investigation",
    objective: "Understand the system",
    question: "Why?",
    status: "Draft",
    experimentIds: [],
    evidenceIds: [],
    findingIds: [REPLACEMENT_FINDING_ID],
    artifactIds: [],
    conclusionIds: [CONCLUSION_ID],
    createdAt: "2026-08-30T00:00:00.000Z",
    updatedAt: "2026-08-30T00:00:00.000Z",
  };
}

function createConclusion(): ResearchInvestigationConclusion {
  return {
    id: CONCLUSION_ID,
    investigationId: INVESTIGATION_ID,
    statement: "Conclusion statement",
    status: "Proposed",
    supportingFindingIds: [SOURCE_FINDING_ID],
    contradictingFindingIds: [],
    createdAt: "2026-08-30T00:00:00.000Z",
    updatedAt: "2026-08-30T00:00:00.000Z",
  };
}

function createFinding(id: string): ResearchFinding {
  return {
    id,
    statement: `Finding ${id}`,
    evidenceAssessments: [],
    validationIds: [],
    createdAt: "2026-08-30T00:00:00.000Z",
    updatedAt: "2026-08-30T00:00:00.000Z",
  };
}

function createPlan(): ResearchLineageIntegrityRemediationPlan {
  return {
    investigationId: INVESTIGATION_ID,
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    action: "RepairReference",
    target: {
      targetId: CONCLUSION_ID,
      sourceId: SOURCE_FINDING_ID,
    },
    confirmed: true,
  } as ResearchLineageIntegrityRemediationPlan;
}

function configureSnapshot(conclusions: ResearchInvestigationConclusion[] = [createConclusion()]) {
  let persistedConclusions = conclusions;

  getResearchInvestigations.mockResolvedValue([createInvestigation()]);
  getResearchExperiments.mockResolvedValue([]);
  getResearchEvidence.mockResolvedValue([]);
  getResearchFindings.mockResolvedValue([createFinding(REPLACEMENT_FINDING_ID)]);
  getResearchFindingValidations.mockResolvedValue([]);
  getResearchInvestigationConclusions.mockImplementation(async () => persistedConclusions);
  getResearchProvenanceEvents.mockResolvedValue([]);

  persistResearchLineageRemediationMutation.mockImplementation(async (input) => {
    persistedConclusions = persistedConclusions.map((conclusion) =>
      conclusion.id === input.conclusionId
        ? {
            ...conclusion,
            statement: input.conclusion.statement,
            status: input.conclusion.status,
            supportingFindingIds: input.conclusion.supportingFindingIds ?? [],
            contradictingFindingIds: input.conclusion.contradictingFindingIds ?? [],
            uncertainty: input.conclusion.uncertainty,
            nextAction: input.conclusion.nextAction,
            updatedAt: input.conclusion.updatedAt.toISOString(),
          }
        : conclusion,
    );

    return {
      provenanceEventId: "research-provenance-001",
    };
  });
}

describe("research lineage remediation server executor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("orchestrates deterministic repair through atomic persistence", async () => {
    configureSnapshot();

    const result = await executeResearchLineageIntegrityRemediationOnServer(createPlan());

    expect(persistResearchLineageRemediationMutation).toHaveBeenCalledTimes(1);

    const [input] = persistResearchLineageRemediationMutation.mock.calls[0];

    expect(input.conclusionId).toBe(CONCLUSION_ID);

    expect(input.expectedUpdatedAt).toEqual(
      new Date("2026-08-30T00:00:00.000Z"),
    );

    expect(input.conclusion).toMatchObject({
      statement: expect.any(String),
      status: expect.any(String),
      supportingFindingIds: [REPLACEMENT_FINDING_ID],
      contradictingFindingIds: [],
      updatedAt: expect.any(Date),
    });

    expect(input.provenance).toMatchObject({
      investigationId: INVESTIGATION_ID,
      entityType: "Conclusion",
      entityId: CONCLUSION_ID,
      eventType: "Updated",
      reason: `Deterministic remediation replaced invalid finding reference ${SOURCE_FINDING_ID} with ${REPLACEMENT_FINDING_ID}.`,
    });

    expect(input.conclusion.updatedAt).not.toBe(createConclusion().updatedAt);

    expect(result).toMatchObject({
      investigationId: INVESTIGATION_ID,
      action: "RepairReference",
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      executed: true,
      mutationType: "ReferenceReplacement",
      provenanceEventId: "research-provenance-001",
    });
  });

  it("reports a committed mutation when postcondition verification remains invalid", async () => {
    configureSnapshot();

    const persistedConclusions = [
      {
        ...createConclusion(),
        supportingFindingIds: [SOURCE_FINDING_ID],
      },
    ];

    getResearchInvestigationConclusions.mockImplementationOnce(
      async () => [createConclusion()],
    ).mockImplementation(async () => persistedConclusions);

    persistResearchLineageRemediationMutation.mockImplementationOnce(async () => ({
      provenanceEventId: "research-provenance-committed",
    }));

    const result = await executeResearchLineageIntegrityRemediationOnServer(createPlan());

    expect(persistResearchLineageRemediationMutation).toHaveBeenCalledTimes(1);
    expect(createResearchReconciliationObligationRecord).toHaveBeenCalledTimes(1);

    const [obligation] = createResearchReconciliationObligationRecord.mock.calls[0];

    expect(obligation).toMatchObject({
      investigationId: INVESTIGATION_ID,
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      targetEntityType: "Conclusion",
      targetEntityId: CONCLUSION_ID,
      remediationAction: "RepairReference",
      provenanceEventId: "research-provenance-committed",
      status: "Open",
      reason:
        "The remediation mutation was committed, but postcondition validation still reports an invalid conclusion finding reference.",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(obligation.id).toMatch(/^research-reconciliation-/);
    expect(obligation.remediationExecutionId).toBeUndefined();
    expect(obligation.resolvedAt).toBeUndefined();
    expect(obligation.createdAt).toEqual(obligation.updatedAt);

    expect(result.executed).toBe(true);
    expect(result.provenanceEventId).toBe("research-provenance-committed");
    expect(result.postcondition?.validated).toBe(true);
    expect(result.postcondition?.valid).toBe(false);
    expect(result.message).toContain("reference mutation was persisted");
  });
});
