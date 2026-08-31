import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ResearchEvidenceAssessment,
  ResearchFinding,
} from "@/types/research";

import {
  createResearchEvidenceAssessment,
  createResearchEvidenceAssessmentService,
  removeResearchFindingEvidenceAssessment,
  updateResearchFindingEvidenceAssessment,
} from "../assessment";

describe("research evidence assessment", () => {
  const now = "2026-01-10T00:00:00.000Z";
  const updatedAt = "2026-01-10T01:00:00.000Z";

  const finding: ResearchFinding = {
    id: "finding-001",
    statement: "The observed metric supports the hypothesis.",
    evidenceAssessments: [],
    confidence: 0.8,
    validationIds: [],
    createdAt: now,
    updatedAt: now,
  };

  const assessment: ResearchEvidenceAssessment = {
    id: "assessment-001",
    evidenceId: "evidence-001",
    type: "Supporting",
    relevance: 0.9,
    supportStrength: 0.8,
    reliability: 0.95,
    independence: 0.85,
    rationale: "The evidence directly supports the finding.",
    assessedAt: now,
    updatedAt: now,
  };

  let findings: ResearchFinding[];
  let saveResearchFinding: (finding: ResearchFinding) => void;
  let createId: (prefix: string) => string;
  let nowMock: () => string;

  beforeEach(() => {
    findings = [structuredClone(finding)];

    saveResearchFinding = vi.fn<(finding: ResearchFinding) => void>();

    createId = vi.fn<(prefix: string) => string>(
      () => "assessment-created-001",
    );

    nowMock = vi.fn<() => string>(() => updatedAt);
  });

  const dependencies = () => ({
    getResearchFindings: () => findings,
    saveResearchFinding,
    createId,
    now: nowMock,
  });

  it("creates an assessment with deterministic identity and timestamps", () => {
    const result = createResearchEvidenceAssessment(
      {
        evidenceId: "evidence-001",
        type: "Supporting",
        relevance: 0.9,
        supportStrength: 0.8,
        reliability: 0.95,
        independence: 0.85,
        rationale: "Direct support.",
      },
      dependencies(),
    );

    expect(result).toEqual({
      id: "assessment-created-001",
      evidenceId: "evidence-001",
      type: "Supporting",
      relevance: 0.9,
      supportStrength: 0.8,
      reliability: 0.95,
      independence: 0.85,
      rationale: "Direct support.",
      assessedAt: updatedAt,
      updatedAt,
    });

    expect(createId).toHaveBeenCalledWith("evidence-assessment");
    expect(nowMock).toHaveBeenCalledTimes(1);
  });

  it("preserves all assessment classification values", () => {
    const result = createResearchEvidenceAssessment(
      {
        evidenceId: "evidence-002",
        type: "Contradicting",
        relevance: 0.7,
        supportStrength: 0.6,
        reliability: 0.8,
        independence: 0.75,
      },
      dependencies(),
    );

    expect(result.evidenceId).toBe("evidence-002");
    expect(result.type).toBe("Contradicting");
    expect(result.relevance).toBe(0.7);
    expect(result.supportStrength).toBe(0.6);
    expect(result.reliability).toBe(0.8);
    expect(result.independence).toBe(0.75);
  });

  it("updates an existing assessment without changing unrelated assessments", () => {
    const unrelated: ResearchEvidenceAssessment = {
      ...assessment,
      id: "assessment-unrelated",
      evidenceId: "evidence-unrelated",
    };

    findings[0].evidenceAssessments = [
      assessment,
      unrelated,
    ];

    const replacement: ResearchEvidenceAssessment = {
      ...assessment,
      supportStrength: 0.95,
      rationale: "Updated assessment.",
      updatedAt,
    };

    const result = updateResearchFindingEvidenceAssessment(
      finding.id,
      replacement,
      dependencies(),
    );

    expect(result).not.toBeNull();
    expect(result?.evidenceAssessments).toEqual([
      replacement,
      unrelated,
    ]);
    expect(saveResearchFinding).toHaveBeenCalledWith(result);
  });

  it("appends a new assessment when the assessment id is not present", () => {
    const result = updateResearchFindingEvidenceAssessment(
      finding.id,
      assessment,
      dependencies(),
    );

    expect(result?.evidenceAssessments).toEqual([assessment]);
    expect(saveResearchFinding).toHaveBeenCalledTimes(1);
  });

  it("returns null and does not persist when the finding does not exist", () => {
    const result = updateResearchFindingEvidenceAssessment(
      "missing-finding",
      assessment,
      dependencies(),
    );

    expect(result).toBeNull();
    expect(saveResearchFinding).not.toHaveBeenCalled();
  });

  it("updates the finding timestamp when an assessment is changed", () => {
    const result = updateResearchFindingEvidenceAssessment(
      finding.id,
      assessment,
      dependencies(),
    );

    expect(result?.updatedAt).toBe(updatedAt);
    expect(nowMock).toHaveBeenCalledTimes(1);
  });

  it("removes the requested assessment", () => {
    const unrelated: ResearchEvidenceAssessment = {
      ...assessment,
      id: "assessment-unrelated",
      evidenceId: "evidence-unrelated",
    };

    findings[0].evidenceAssessments = [
      assessment,
      unrelated,
    ];

    const result = removeResearchFindingEvidenceAssessment(
      finding.id,
      assessment.id,
      dependencies(),
    );

    expect(result?.evidenceAssessments).toEqual([unrelated]);
    expect(saveResearchFinding).toHaveBeenCalledWith(result);
  });

  it("does not fail when removing a nonexistent assessment", () => {
    findings[0].evidenceAssessments = [assessment];

    const result = removeResearchFindingEvidenceAssessment(
      finding.id,
      "missing-assessment",
      dependencies(),
    );

    expect(result?.evidenceAssessments).toEqual([assessment]);
    expect(saveResearchFinding).toHaveBeenCalledWith(result);
  });

  it("returns null and does not persist when removing from a missing finding", () => {
    const result = removeResearchFindingEvidenceAssessment(
      "missing-finding",
      assessment.id,
      dependencies(),
    );

    expect(result).toBeNull();
    expect(saveResearchFinding).not.toHaveBeenCalled();
  });

  it("does not mutate the original finding object", () => {
    findings[0].evidenceAssessments = [assessment];

    const original = structuredClone(findings[0]);

    updateResearchFindingEvidenceAssessment(
      finding.id,
      {
        ...assessment,
        supportStrength: 0.5,
      },
      dependencies(),
    );

    expect(findings[0]).toEqual(original);
  });

  it("exposes assessment operations through the factory", () => {
    const service = createResearchEvidenceAssessmentService(
      dependencies(),
    );

    expect(
      service.createResearchEvidenceAssessment({
        evidenceId: "evidence-001",
        type: "Supporting",
        relevance: 0.9,
        supportStrength: 0.8,
        reliability: 0.95,
        independence: 0.85,
        rationale: "Factory test.",
      }),
    ).toMatchObject({
      evidenceId: "evidence-001",
      type: "Supporting",
    });
  });
});
