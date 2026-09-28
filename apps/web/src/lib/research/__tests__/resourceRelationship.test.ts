import { describe, expect, it } from "vitest";

import type {
  ResearchEvidenceAssessment,
  ResearchExperiment,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigation,
} from "@/types/research";

import {
  toResearchEvidenceAssessmentResourceRelationship,
  toResearchFindingValidationResourceRelationship,
  toResearchInvestigationExperimentResourceRelationship,
} from "@/lib/research/resourceRelationship";

function createAssessment(
  overrides: Partial<ResearchEvidenceAssessment> = {},
): ResearchEvidenceAssessment {
  return {
    id: "evidence-assessment-001",
    evidenceId: "evidence-001",
    type: "Supporting",
    relevance: 0.9,
    supportStrength: 0.8,
    reliability: 0.95,
    independence: 0.85,
    assessedAt: "2026-09-28T08:00:00.000Z",
    updatedAt: "2026-09-28T08:05:00.000Z",
    ...overrides,
  };
}

function createFinding(
  overrides: Partial<ResearchFinding> = {},
): ResearchFinding {
  return {
    id: "finding-001",
    statement: "The evidence supports the finding.",
    evidenceAssessments: [],
    confidence: 0.9,
    validationIds: [],
    createdAt: "2026-09-28T07:00:00.000Z",
    updatedAt: "2026-09-28T08:00:00.000Z",
    ...overrides,
  };
}

function createInvestigation(
  overrides: Partial<ResearchInvestigation> = {},
): ResearchInvestigation {
  return {
    id: "investigation-001",
    title: "Research investigation",
    objective: "Evaluate the research question.",
    question: "Does the evidence support the hypothesis?",
    status: "Investigating",
    experimentIds: ["experiment-001"],
    evidenceIds: [],
    findingIds: [],
    artifactIds: [],
    conclusionIds: [],
    createdAt: "2026-09-28T07:00:00.000Z",
    updatedAt: "2026-09-28T08:00:00.000Z",
    ...overrides,
  };
}

function createExperiment(
  overrides: Partial<ResearchExperiment> = {},
): ResearchExperiment {
  return {
    id: "experiment-001",
    investigationId: "investigation-001",
    title: "Research experiment",
    objective: "Evaluate the hypothesis.",
    status: "Draft",
    evidenceIds: [],
    findingIds: [],
    lifecycle: [],
    createdAt: "2026-09-28T08:10:00.000Z",
    updatedAt: "2026-09-28T08:15:00.000Z",
    ...overrides,
  };
}

function createValidation(
  overrides: Partial<ResearchFindingValidation> = {},
): ResearchFindingValidation {
  return {
    id: "finding-validation-001",
    findingId: "finding-001",
    status: "Validated",
    decision: "Accept",
    rationale: "The finding has sufficient supporting evidence.",
    validator: "validator-001",
    confidenceAtValidation: 0.9,
    evidenceAssessmentCount: 2,
    supportingEvidenceCount: 2,
    contradictingEvidenceCount: 0,
    createdAt: "2026-09-28T08:10:00.000Z",
    updatedAt: "2026-09-28T08:15:00.000Z",
    validatedAt: "2026-09-28T08:15:00.000Z",
    ...overrides,
  };
}

describe("research investigation experiment resource relationship mapping contracts", () => {
  it("maps an investigation to its experiment as a directed Contains relationship", () => {
    expect(
      toResearchInvestigationExperimentResourceRelationship(
        createInvestigation(),
        createExperiment(),
      ),
    ).toEqual({
      id: "relationship-experiment-001-Contains",
      source: {
        id: "investigation-001",
        type: "investigation",
        namespace: "research",
      },
      target: {
        id: "experiment-001",
        type: "experiment",
        namespace: "research",
      },
      namespace: "research",
      type: "Contains",
      createdAt: "2026-09-28T08:10:00.000Z",
    });
  });

  it("uses the experiment createdAt rather than updatedAt", () => {
    const experiment = createExperiment({
      createdAt: "2026-09-01T10:00:00.000Z",
      updatedAt: "2026-09-28T10:00:00.000Z",
    });

    expect(
      toResearchInvestigationExperimentResourceRelationship(
        createInvestigation(),
        experiment,
      ),
    ).toMatchObject({
      createdAt: "2026-09-01T10:00:00.000Z",
    });
  });

  it("preserves the investigation-to-experiment direction", () => {
    const relationship =
      toResearchInvestigationExperimentResourceRelationship(
        createInvestigation({
          id: "investigation-source",
        }),
        createExperiment({
          investigationId: "investigation-source",
          id: "experiment-target",
        }),
      );

    expect(relationship?.source).toEqual({
      id: "investigation-source",
      type: "investigation",
      namespace: "research",
    });

    expect(relationship?.target).toEqual({
      id: "experiment-target",
      type: "experiment",
      namespace: "research",
    });
  });

  it("keeps relationship identity deterministic for the same experiment", () => {
    const first = toResearchInvestigationExperimentResourceRelationship(
      createInvestigation(),
      createExperiment(),
    );

    const second = toResearchInvestigationExperimentResourceRelationship(
      createInvestigation(),
      createExperiment(),
    );

    expect(first?.id).toBe(second?.id);
  });

  it("returns null when the experiment belongs to a different investigation", () => {
    const relationship =
      toResearchInvestigationExperimentResourceRelationship(
        createInvestigation({
          id: "investigation-001",
        }),
        createExperiment({
          investigationId: "investigation-002",
        }),
      );

    expect(relationship).toBeNull();
  });
});

describe("research evidence assessment resource relationship mapping contracts", () => {
  it("maps Supporting to a directed Supports relationship", () => {
    expect(
      toResearchEvidenceAssessmentResourceRelationship(
        createFinding(),
        createAssessment({
          type: "Supporting",
        }),
      ),
    ).toEqual({
      id: "relationship-evidence-assessment-001-Supports",
      source: {
        id: "evidence-001",
        type: "evidence",
        namespace: "research",
      },
      target: {
        id: "finding-001",
        type: "finding",
        namespace: "research",
      },
      namespace: "research",
      type: "Supports",
      createdAt: "2026-09-28T08:00:00.000Z",
    });
  });

  it("maps Contradicting to a directed Contradicts relationship", () => {
    expect(
      toResearchEvidenceAssessmentResourceRelationship(
        createFinding(),
        createAssessment({
          type: "Contradicting",
        }),
      ),
    ).toEqual({
      id: "relationship-evidence-assessment-001-Contradicts",
      source: {
        id: "evidence-001",
        type: "evidence",
        namespace: "research",
      },
      target: {
        id: "finding-001",
        type: "finding",
        namespace: "research",
      },
      namespace: "research",
      type: "Contradicts",
      createdAt: "2026-09-28T08:00:00.000Z",
    });
  });

  it("does not create a relationship for Neutral", () => {
    expect(
      toResearchEvidenceAssessmentResourceRelationship(
        createFinding(),
        createAssessment({
          type: "Neutral",
        }),
      ),
    ).toBeNull();
  });

  it("uses the assessment assessedAt rather than updatedAt", () => {
    const assessment = createAssessment({
      assessedAt: "2026-09-01T10:00:00.000Z",
      updatedAt: "2026-09-28T10:00:00.000Z",
    });

    expect(
      toResearchEvidenceAssessmentResourceRelationship(
        createFinding(),
        assessment,
      ),
    ).toMatchObject({
      createdAt: "2026-09-01T10:00:00.000Z",
    });
  });

  it("preserves the evidence-to-finding direction", () => {
    const relationship =
      toResearchEvidenceAssessmentResourceRelationship(
        createFinding({
          id: "finding-target",
        }),
        createAssessment({
          evidenceId: "evidence-source",
        }),
      );

    expect(relationship?.source).toEqual({
      id: "evidence-source",
      type: "evidence",
      namespace: "research",
    });

    expect(relationship?.target).toEqual({
      id: "finding-target",
      type: "finding",
      namespace: "research",
    });
  });

  it("keeps relationship identity deterministic for the same assessment and type", () => {
    const first = toResearchEvidenceAssessmentResourceRelationship(
      createFinding(),
      createAssessment({
        type: "Supporting",
      }),
    );

    const second = toResearchEvidenceAssessmentResourceRelationship(
      createFinding(),
      createAssessment({
        type: "Supporting",
      }),
    );

    expect(first?.id).toBe(second?.id);
  });

  it("changes relationship identity when the relationship type changes", () => {
    const supporting =
      toResearchEvidenceAssessmentResourceRelationship(
        createFinding(),
        createAssessment({
          type: "Supporting",
        }),
      );

    const contradicting =
      toResearchEvidenceAssessmentResourceRelationship(
        createFinding(),
        createAssessment({
          type: "Contradicting",
        }),
      );

    expect(supporting?.id).not.toBe(contradicting?.id);
  });

  it("maps a finding to its validation as a directed Validates relationship", () => {
    expect(
      toResearchFindingValidationResourceRelationship(
        createFinding(),
        createValidation(),
      ),
    ).toEqual({
      id: "relationship-finding-validation-001-Validates",
      source: {
        id: "finding-001",
        type: "finding",
        namespace: "research",
      },
      target: {
        id: "finding-validation-001",
        type: "validation",
        namespace: "research",
      },
      namespace: "research",
      type: "Validates",
      createdAt: "2026-09-28T08:10:00.000Z",
    });
  });

  it("uses the validation createdAt rather than updatedAt", () => {
    const validation = createValidation({
      createdAt: "2026-09-01T10:00:00.000Z",
      updatedAt: "2026-09-28T10:00:00.000Z",
    });

    expect(
      toResearchFindingValidationResourceRelationship(
        createFinding(),
        validation,
      ),
    ).toMatchObject({
      createdAt: "2026-09-01T10:00:00.000Z",
    });
  });

  it("preserves the finding-to-validation direction", () => {
    const relationship =
      toResearchFindingValidationResourceRelationship(
        createFinding({
          id: "finding-source",
        }),
        createValidation({
          findingId: "finding-source",
          id: "validation-target",
        }),
      );

    expect(relationship?.source).toEqual({
      id: "finding-source",
      type: "finding",
      namespace: "research",
    });

    expect(relationship?.target).toEqual({
      id: "validation-target",
      type: "validation",
      namespace: "research",
    });
  });

  it("uses the validation resource identity as the relationship target", () => {
    const relationship =
      toResearchFindingValidationResourceRelationship(
        createFinding(),
        createValidation({
          id: "validation-identity-001",
        }),
      );

    expect(relationship?.target).toEqual({
      id: "validation-identity-001",
      type: "validation",
      namespace: "research",
    });
  });

  it("keeps relationship identity deterministic for the same validation", () => {
    const first = toResearchFindingValidationResourceRelationship(
      createFinding(),
      createValidation({
        id: "validation-stable-001",
      }),
    );

    const second = toResearchFindingValidationResourceRelationship(
      createFinding(),
      createValidation({
        id: "validation-stable-001",
      }),
    );

    expect(first?.id).toBe(second?.id);
    expect(first?.id).toBe(
      "relationship-validation-stable-001-Validates",
    );
  });

  it("returns null when the validation belongs to a different finding", () => {
    const relationship =
      toResearchFindingValidationResourceRelationship(
        createFinding({
          id: "finding-001",
        }),
        createValidation({
          findingId: "finding-002",
        }),
      );

    expect(relationship).toBeNull();
  });
});
