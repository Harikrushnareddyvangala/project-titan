import { beforeEach, describe, expect, it } from "vitest";

import type {
  ResearchFinding,
} from "@/types/research";

import {
  attachResearchInvestigationConclusion,
  createResearchEvidenceAssessment,
  createResearchFindingValidation,
  createResearchInvestigation,
  createResearchInvestigationConclusion,
  getResearchFindingValidations,
  getResearchInvestigationConclusions,
  getResearchInvestigations,
  getResearchFindings,
  getResearchEvidence,
  saveResearchEvidence,
  saveResearchFinding,
  saveResearchInvestigation,
  transitionResearchExperiment,
  validateResearchLineage,
} from "@/lib/research";

describe("research lifecycle contracts", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates an investigation in Draft with empty relationship collections", () => {
    const investigation = createResearchInvestigation({
      title: "Lifecycle investigation",
      objective: "Verify investigation creation semantics",
      question: "Does a new investigation initialize safely?",
    });

    expect(investigation.status).toBe("Draft");
    expect(investigation.experimentIds).toEqual([]);
    expect(investigation.evidenceIds).toEqual([]);
    expect(investigation.findingIds).toEqual([]);
    expect(investigation.artifactIds).toEqual([]);
    expect(investigation.conclusionIds).toEqual([]);
    expect(investigation.createdAt).toBe(investigation.updatedAt);
  });

  it("persists an investigation through the investigation repository API", () => {
    const investigation = createResearchInvestigation({
      title: "Persistence investigation",
      objective: "Verify investigation persistence",
      question: "Can an investigation be saved and retrieved?",
    });

    saveResearchInvestigation(investigation);

    expect(
      getResearchInvestigations().some(
        (candidate) => candidate.id === investigation.id,
      ),
    ).toBe(true);
  });

  it("accepts the first valid experiment lifecycle transition", () => {
    const now = new Date().toISOString();

    const experiment = {
      id: "experiment-lifecycle-001",
      investigationId: "investigation-lifecycle-001",
      title: "Lifecycle experiment",
      objective: "Verify lifecycle transitions",
      status: "Draft" as const,
      evidenceIds: [],
      findingIds: [],
      lifecycle: [],
      createdAt: now,
      updatedAt: now,
    };

    const transitioned = transitionResearchExperiment(
      experiment,
      "Investigating",
      "Begin investigation",
    );

    expect(transitioned).not.toBeNull();
    expect(transitioned?.status).toBe("Investigating");
    expect(transitioned?.lifecycle).toHaveLength(1);
    expect(transitioned?.lifecycle[0].from).toBe("Draft");
    expect(transitioned?.lifecycle[0].to).toBe("Investigating");
  });

  it("rejects an invalid experiment lifecycle transition", () => {
    const now = new Date().toISOString();

    const experiment = {
      id: "experiment-lifecycle-002",
      investigationId: "investigation-lifecycle-002",
      title: "Invalid transition experiment",
      objective: "Verify transition safety",
      status: "Draft" as const,
      evidenceIds: [],
      findingIds: [],
      lifecycle: [],
      createdAt: now,
      updatedAt: now,
    };

    expect(
      transitionResearchExperiment(experiment, "Validated"),
    ).toBeNull();
  });

  it("persists evidence without changing its identity", () => {
    const evidence = {
      id: "evidence-lifecycle-001",
      type: "Analysis" as const,
      title: "Lifecycle evidence",
      description: "Evidence used by the lifecycle contract suite.",
      createdAt: new Date().toISOString(),
    };

    saveResearchEvidence(evidence);

    const persistedEvidence = getResearchEvidence().find(
      (candidate) => candidate.id === evidence.id,
    );

    expect(persistedEvidence).toEqual(evidence);
  });

  it("creates a finding whose evidence relationship is represented by assessments", () => {
    const evidenceId = "evidence-lifecycle-002";

    saveResearchEvidence({
      id: evidenceId,
      type: "Metric",
      title: "Observed metric",
      createdAt: new Date().toISOString(),
    });

    const finding: ResearchFinding = {
      id: "finding-lifecycle-001",
      statement: "The observed metric supports the hypothesis.",
      evidenceAssessments: [],
      confidence: undefined,
      validationIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const assessment = createResearchEvidenceAssessment({
      evidenceId,
      type: "Supporting",
      relevance: 0.9,
      supportStrength: 0.8,
      reliability: 0.95,
      independence: 0.85,
      rationale: "The evidence directly supports the finding.",
    });

    finding.evidenceAssessments = [assessment];

    saveResearchFinding(finding);

    expect(
      getResearchFindings().find(
        (candidate) => candidate.id === finding.id,
      )?.evidenceAssessments,
    ).toHaveLength(1);

    expect(
      getResearchFindings().find(
        (candidate) => candidate.id === finding.id,
      )?.evidenceAssessments[0].evidenceId,
    ).toBe(evidenceId);
  });

  it("creates finding validation with the evidence assessment snapshot", () => {
    const findingId = "finding-lifecycle-002";

    const finding = {
      id: findingId,
      statement: "Validated lifecycle finding",
      evidenceAssessments: [
        {
          id: "assessment-lifecycle-001",
          evidenceId: "evidence-lifecycle-003",
          type: "Supporting" as const,
          relevance: 0.9,
          supportStrength: 0.8,
          reliability: 0.95,
          independence: 0.85,
          assessedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      confidence: 0.82,
      validationIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveResearchFinding(finding);

    const result = createResearchFindingValidation(
      findingId,
      {
        status: "Validated",
        decision: "Accept",
        rationale: "Lifecycle contract validation",
      },
    );

    expect(result.success).toBe(true);
    expect(result.validation).not.toBeNull();

    if (!result.validation) {
      return;
    }

    expect(result.validation.findingId).toBe(findingId);
    expect(result.validation.confidenceAtValidation).toBe(0.82);
    expect(result.validation.evidenceAssessmentCount).toBe(1);
    expect(result.validation.supportingEvidenceCount).toBe(1);
    expect(result.validation.contradictingEvidenceCount).toBe(0);

    expect(
      getResearchFindingValidations().some(
        (candidate) => candidate.id === result.validation?.id,
      ),
    ).toBe(true);
  });

  it("preserves supporting and contradicting findings in a conclusion", () => {
    const investigation = createResearchInvestigation({
      title: "Conclusion lifecycle investigation",
      objective: "Verify conclusion semantics",
      question: "Are opposing findings preserved?",
    });

    saveResearchInvestigation(investigation);

    const conclusion = createResearchInvestigationConclusion({
      investigationId: investigation.id,
      statement: "The evidence supports the proposed conclusion.",
      status: "Proposed",
      supportingFindingIds: ["finding-supporting-001"],
      contradictingFindingIds: ["finding-contradicting-001"],
      uncertainty: "Further evidence is required.",
      nextAction: "Run another experiment.",
    });

    expect(conclusion.supportingFindingIds).toEqual([
      "finding-supporting-001",
    ]);
    expect(conclusion.contradictingFindingIds).toEqual([
      "finding-contradicting-001",
    ]);
    expect(conclusion.uncertainty).toBe(
      "Further evidence is required.",
    );
    expect(conclusion.nextAction).toBe(
      "Run another experiment.",
    );
  });

  it("attaches a conclusion to its investigation", () => {
    const investigation = createResearchInvestigation({
      title: "Conclusion attachment investigation",
      objective: "Verify conclusion ownership",
      question: "Can a conclusion be attached safely?",
    });

    saveResearchInvestigation(investigation);

    const conclusion = createResearchInvestigationConclusion({
      investigationId: investigation.id,
      statement: "Attachment contract conclusion",
      status: "Draft",
      supportingFindingIds: [],
      contradictingFindingIds: [],
    });

    attachResearchInvestigationConclusion(
      investigation.id,
      conclusion.id,
    );

    expect(
      getResearchInvestigationConclusions().some(
        (candidate) => candidate.id === conclusion.id,
      ),
    ).toBe(true);

    expect(
      getResearchInvestigations().find(
        (candidate) => candidate.id === investigation.id,
      )?.conclusionIds,
    ).toContain(conclusion.id);
  });

  it("derives a valid lineage graph from a coherent investigation", () => {
    const now = new Date().toISOString();

    const investigation = {
      id: "investigation-lifecycle-003",
      title: "Coherent lifecycle investigation",
      objective: "Verify lineage construction",
      question: "Can coherent research relationships produce valid lineage?",
      status: "Draft" as const,
      experimentIds: [],
      evidenceIds: ["evidence-lifecycle-004"],
      findingIds: ["finding-lifecycle-003"],
      artifactIds: [],
      conclusionIds: ["conclusion-lifecycle-003"],
      createdAt: now,
      updatedAt: now,
    };

    saveResearchInvestigation(investigation);

    saveResearchEvidence({
      id: "evidence-lifecycle-004",
      type: "Analysis",
      title: "Lifecycle analysis",
      createdAt: now,
    });

    saveResearchFinding({
      id: "finding-lifecycle-003",
      statement: "Coherent lifecycle finding",
      evidenceAssessments: [
        {
          id: "assessment-lifecycle-004",
          evidenceId: "evidence-lifecycle-004",
          type: "Supporting",
          relevance: 0.9,
          supportStrength: 0.9,
          reliability: 0.9,
          independence: 0.9,
          assessedAt: now,
          updatedAt: now,
        },
      ],
      confidence: 0.9,
      validationIds: [],
      createdAt: now,
      updatedAt: now,
    });

    saveResearchInvestigation({
      ...investigation,
      conclusionIds: ["conclusion-lifecycle-003"],
    });

    localStorage.setItem(
      "titan:research-investigation-conclusions",
      JSON.stringify([
        {
          id: "conclusion-lifecycle-003",
          investigationId: investigation.id,
          statement: "Coherent lifecycle conclusion",
          status: "Draft",
          supportingFindingIds: ["finding-lifecycle-003"],
          contradictingFindingIds: [],
          createdAt: now,
          updatedAt: now,
        },
      ]),
    );

    const lineage = validateResearchLineage(investigation.id);

    expect(lineage.valid).toBe(true);
    expect(lineage.issues).toEqual([]);
  });
});
