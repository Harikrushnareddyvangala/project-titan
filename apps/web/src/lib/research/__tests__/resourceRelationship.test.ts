import { describe, expect, it } from "vitest";

import type {
  ResearchEvidenceAssessment,
  ResearchFinding,
} from "@/types/research";

import {
  toResearchEvidenceAssessmentResourceRelationship,
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
});
