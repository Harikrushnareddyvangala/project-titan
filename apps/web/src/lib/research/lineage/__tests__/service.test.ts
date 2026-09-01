import { describe, expect, it, vi } from "vitest";

import type {
  ResearchInvestigation,
  ResearchProvenanceIntegrityResult,
} from "@/types/research";

import {
  createResearchLineageService,
  type ResearchLineageServiceDependencies,
} from "../service";

function createDependencies(): ResearchLineageServiceDependencies {
  const investigation: ResearchInvestigation = {
  id: "investigation-001",
  title: "Test investigation",
  objective: "Test lineage service",
  question: "Does the lineage service expose graph and validation correctly?",
  status: "Draft",
  description: "Test investigation for lineage service coverage.",
  experimentIds: [],
  evidenceIds: [],
  findingIds: [],
  artifactIds: [],
  conclusionIds: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

  const provenanceIntegrity: ResearchProvenanceIntegrityResult = {
    valid: true,
    checkedEventCount: 0,
    issues: [],
  };

  return {
    getResearchInvestigations: vi.fn(() => [investigation]),
    getResearchExperiments: vi.fn(() => []),
    getResearchEvidence: vi.fn(() => []),
    getResearchFindings: vi.fn(() => []),
    getResearchFindingValidations: vi.fn(() => []),
    getResearchInvestigationConclusions: vi.fn(() => []),
    getResearchProvenanceEventsByInvestigation: vi.fn(() => []),
    validateResearchProvenanceIntegrity: vi.fn(
      () => provenanceIntegrity,
    ),
  };
}

describe("research lineage service", () => {
  it("exposes the lineage graph through the service factory", () => {
    const dependencies = createDependencies();
    const service = createResearchLineageService(dependencies);

    const result = service.getResearchLineage(
      "investigation-001",
    );

    expect(result.investigationId).toBe("investigation-001");
    expect(result.valid).toBe(true);
    expect(result.issueCount).toBe(0);

    expect(
      dependencies.getResearchInvestigations,
    ).toHaveBeenCalled();
  });

  it("exposes lineage validation through the service factory", () => {
    const dependencies = createDependencies();
    const service = createResearchLineageService(dependencies);

    const result = service.validateResearchLineage(
      "investigation-001",
    );

    expect(result).toMatchObject({
      investigationId: "investigation-001",
      valid: true,
      issueCount: 0,
    });

    expect(
      dependencies.validateResearchProvenanceIntegrity,
    ).toHaveBeenCalled();
  });

  it("keeps validateResearchLineageForInvestigation as the service-compatible alias", () => {
    const dependencies = createDependencies();
    const service = createResearchLineageService(dependencies);

    const result = service.validateResearchLineageForInvestigation(
      "investigation-001",
    );

    expect(result).toEqual(
      service.validateResearchLineage("investigation-001"),
    );
  });
});
