import { describe, expect, it, vi } from "vitest";

import type { ResearchFinding } from "@/types/research";

import {
  getResearchFindings,
  saveResearchFinding,
} from "../repository";

function createFinding(
  overrides: Partial<ResearchFinding> = {},
): ResearchFinding {
  return {
    id: "finding-001",
    statement: "A research finding",
    evidenceAssessments: [],
    confidence: 0.8,
    validationIds: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function createDependencies(
  findings: ResearchFinding[] = [],
) {
  return {
    loadResearchFindings: vi.fn(() => findings),
    saveResearchFindings: vi.fn(),
    createId: vi.fn((prefix: string) => `${prefix}-generated`),
    now: vi.fn(() => "2026-01-02T00:00:00.000Z"),
  };
}

describe("research finding repository", () => {
  it("loads findings", () => {
    const finding = createFinding();
    const dependencies = createDependencies([finding]);

    expect(getResearchFindings(dependencies)).toEqual([finding]);
  });

  it("normalizes missing validation ids", () => {
    const finding = createFinding({
      validationIds: undefined as unknown as string[],
    });
    const dependencies = createDependencies([finding]);

    expect(getResearchFindings(dependencies)[0].validationIds).toEqual([]);
  });

  it("preserves existing evidence assessments", () => {
    const assessment = {
      id: "assessment-001",
      evidenceId: "evidence-001",
      type: "Supporting" as const,
      relevance: 0.9,
      supportStrength: 0.8,
      reliability: 0.9,
      independence: 0.7,
      rationale: "Direct support.",
      assessedAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    const finding = createFinding({
      evidenceAssessments: [assessment],
    });

    const dependencies = createDependencies([finding]);

    expect(getResearchFindings(dependencies)[0].evidenceAssessments).toEqual([
      assessment,
    ]);

    expect(dependencies.createId).not.toHaveBeenCalled();
  });

  it("migrates legacy evidence ids into assessments", () => {
    const legacyFinding = {
      ...createFinding(),
      evidenceAssessments: undefined,
      evidenceIds: ["evidence-001", "evidence-002"],
    } as unknown as ResearchFinding & { evidenceIds: string[] };

    const dependencies = createDependencies([legacyFinding]);

    const [result] = getResearchFindings(dependencies);

    expect(result.evidenceAssessments).toHaveLength(2);
    expect(result.evidenceAssessments.map((item) => item.evidenceId)).toEqual([
      "evidence-001",
      "evidence-002",
    ]);

    expect(dependencies.createId).toHaveBeenCalledTimes(2);
  });

  it("uses existing timestamps during normalization", () => {
    const finding = createFinding();

    const dependencies = createDependencies([finding]);

    getResearchFindings(dependencies);

    expect(dependencies.now).not.toHaveBeenCalled();
  });

  it("uses current time when timestamps are missing", () => {
    const finding = {
      ...createFinding(),
      createdAt: undefined,
      updatedAt: undefined,
      evidenceAssessments: [],
    } as unknown as ResearchFinding;

    const dependencies = createDependencies([finding]);

    const [result] = getResearchFindings(dependencies);

    expect(result.createdAt).toBe("2026-01-02T00:00:00.000Z");
    expect(result.updatedAt).toBe("2026-01-02T00:00:00.000Z");
  });

  it("updates an existing finding", () => {
    const existing = createFinding();
    const dependencies = createDependencies([existing]);

    const updated = createFinding({
      statement: "Updated finding",
    });

    saveResearchFinding(updated, dependencies);

    expect(dependencies.saveResearchFindings).toHaveBeenCalledWith([
      updated,
    ]);
  });

  it("inserts a new finding at the beginning", () => {
    const existing = createFinding();
    const dependencies = createDependencies([existing]);

    const created = createFinding({
      id: "finding-002",
    });

    saveResearchFinding(created, dependencies);

    expect(dependencies.saveResearchFindings).toHaveBeenCalledWith([
      created,
      existing,
    ]);
  });
});
