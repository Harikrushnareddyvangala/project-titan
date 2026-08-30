import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  canTransitionResearchInvestigationConclusion,
  evaluateResearchInvestigationConclusionAcceptance,
  transitionResearchInvestigationConclusion,
} from "../lifecycle";

import type {
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigationConclusion,
} from "@/types/research";

describe("research conclusion lifecycle", () => {
  const now = "2026-01-10T00:00:00.000Z";

  const baseConclusion: ResearchInvestigationConclusion = {
    id: "conclusion-001",
    investigationId: "investigation-001",
    statement: "The evidence supports the hypothesis.",
    status: "Draft",
    supportingFindingIds: ["finding-001"],
    contradictingFindingIds: [],
    uncertainty: "Low uncertainty.",
    nextAction: "Proceed.",
    createdAt: now,
    updatedAt: now,
  };

  const finding: ResearchFinding = {
    id: "finding-001",
    statement: "The experiment supports the hypothesis.",
    confidence: 0.9,
    evidenceAssessments: [],
    validationIds: ["validation-001"],
    createdAt: now,
    updatedAt: now,
  };

  const validation: ResearchFindingValidation = {
    id: "validation-001",
    findingId: "finding-001",
    status: "Validated",
    decision: "Accept",
    rationale: "Evidence supports the finding.",
    confidenceAtValidation: 0.9,
    evidenceAssessmentCount: 0,
    supportingEvidenceCount: 0,
    contradictingEvidenceCount: 0,
    validator: "Researcher",
    validatedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  const dependencies = {
    getResearchFindings: () => [finding],
    getResearchFindingValidations: () => [validation],
    saveResearchInvestigationConclusion: vi.fn(),
    createResearchProvenanceEvent: vi.fn(),
    now: () => now,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows Draft to Proposed", () => {
    expect(
      canTransitionResearchInvestigationConclusion(
        "Draft",
        "Proposed",
      ),
    ).toBe(true);
  });

  it("allows Proposed to Accepted", () => {
    expect(
      canTransitionResearchInvestigationConclusion(
        "Proposed",
        "Accepted",
      ),
    ).toBe(true);
  });

  it("allows Proposed to Draft", () => {
    expect(
      canTransitionResearchInvestigationConclusion(
        "Proposed",
        "Draft",
      ),
    ).toBe(true);
  });

  it("allows Accepted to Superseded", () => {
    expect(
      canTransitionResearchInvestigationConclusion(
        "Accepted",
        "Superseded",
      ),
    ).toBe(true);
  });

  it("rejects transitions out of Superseded", () => {
    expect(
      canTransitionResearchInvestigationConclusion(
        "Superseded",
        "Draft",
      ),
    ).toBe(false);
  });

  it("evaluates a conclusion with no supporting findings as ineligible", () => {
    const result =
      evaluateResearchInvestigationConclusionAcceptance(
        {
          ...baseConclusion,
          supportingFindingIds: [],
        },
        dependencies,
      );

    expect(result.eligible).toBe(false);
    expect(result.supportingFindingCount).toBe(0);
    expect(result.validatedFindingCount).toBe(0);
    expect(result.reasons).toEqual([
      "At least one supporting finding is required.",
    ]);
  });

  it("evaluates a conclusion with a validated finding as eligible", () => {
    const result =
      evaluateResearchInvestigationConclusionAcceptance(
        baseConclusion,
        dependencies,
      );

    expect(result.eligible).toBe(true);
    expect(result.supportingFindingCount).toBe(1);
    expect(result.validatedFindingCount).toBe(1);
    expect(result.reasons).toEqual([]);
  });

  it("reports a missing supporting finding", () => {
    const result =
      evaluateResearchInvestigationConclusionAcceptance(
        {
          ...baseConclusion,
          supportingFindingIds: ["missing-finding"],
        },
        dependencies,
      );

    expect(result.eligible).toBe(false);
    expect(result.validatedFindingCount).toBe(0);
    expect(result.reasons).toEqual([
      "Supporting finding missing-finding was not found.",
    ]);
  });

  it("reports an unvalidated supporting finding", () => {
    const result =
      evaluateResearchInvestigationConclusionAcceptance(
        baseConclusion,
        {
          ...dependencies,
          getResearchFindingValidations: () => [],
        },
      );

    expect(result.eligible).toBe(false);
    expect(result.validatedFindingCount).toBe(0);
    expect(result.reasons).toEqual([
      'Supporting finding "The experiment supports the hypothesis." has not been validated.',
    ]);
  });

  it("returns null for an invalid transition", () => {
    const result =
      transitionResearchInvestigationConclusion(
        baseConclusion,
        "Accepted",
        dependencies,
      );

    expect(result).toBeNull();
    expect(
      dependencies.saveResearchInvestigationConclusion,
    ).not.toHaveBeenCalled();
  });

  it("accepts a Proposed conclusion when all supporting findings are validated", () => {
    const result =
      transitionResearchInvestigationConclusion(
        {
          ...baseConclusion,
          status: "Proposed",
        },
        "Accepted",
        dependencies,
      );

    expect(result).not.toBeNull();
    expect(result?.status).toBe("Accepted");
    expect(result?.updatedAt).toBe(now);
    expect(
      dependencies.saveResearchInvestigationConclusion,
    ).toHaveBeenCalledWith(result);
  });

  it("records provenance for a conclusion transition", () => {
    const result =
      transitionResearchInvestigationConclusion(
        {
          ...baseConclusion,
          status: "Proposed",
        },
        "Accepted",
        dependencies,
      );

    expect(result?.status).toBe("Accepted");
    expect(
      dependencies.createResearchProvenanceEvent,
    ).toHaveBeenCalledWith({
      investigationId: "investigation-001",
      entityType: "Conclusion",
      entityId: "conclusion-001",
      eventType: "Accepted",
      fromStatus: "Proposed",
      toStatus: "Accepted",
    });
  });

  it("returns the existing conclusion for a same-status transition", () => {
    const result =
      transitionResearchInvestigationConclusion(
        baseConclusion,
        "Draft",
        dependencies,
      );

    expect(result).toBe(baseConclusion);
    expect(
      dependencies.saveResearchInvestigationConclusion,
    ).not.toHaveBeenCalled();
  });
});
