import { describe, expect, it, vi } from "vitest";

import type { ResearchProvenanceEvent } from "@/types/research";

import {
  createResearchProvenanceIntegrityService,
  type ResearchProvenanceIntegrityServiceDependencies,
} from "../service";

function createDependencies(): ResearchProvenanceIntegrityServiceDependencies {
  return {
    getResearchProvenanceEvents: vi.fn(() => []),
    getResearchInvestigations: vi.fn(() => []),
    getResearchExperiments: vi.fn(() => []),
    getResearchFindings: vi.fn(() => []),
    getResearchFindingValidations: vi.fn(() => []),
    getResearchInvestigationConclusions: vi.fn(() => []),
  };
}

describe("research provenance integrity service", () => {
  it("exposes provenance integrity validation through the service factory", () => {
    const dependencies = createDependencies();

    const service =
      createResearchProvenanceIntegrityService(dependencies);

    const result =
      service.validateResearchProvenanceIntegrity();

    expect(result).toEqual({
      valid: true,
      checkedEventCount: 0,
      issues: [],
    });

    expect(
      dependencies.getResearchProvenanceEvents,
    ).toHaveBeenCalled();

    expect(
      dependencies.getResearchInvestigations,
    ).toHaveBeenCalled();

    expect(
      dependencies.getResearchExperiments,
    ).toHaveBeenCalled();

    expect(
      dependencies.getResearchFindings,
    ).toHaveBeenCalled();

    expect(
      dependencies.getResearchFindingValidations,
    ).toHaveBeenCalled();

    expect(
      dependencies.getResearchInvestigationConclusions,
    ).toHaveBeenCalled();
  });

  it("returns an empty provenance integrity summary when no issues exist", () => {
    const dependencies = createDependencies();

    const service =
      createResearchProvenanceIntegrityService(dependencies);

    expect(
      service.getResearchProvenanceIntegritySummary(),
    ).toEqual({
      valid: true,
      checkedEventCount: 0,
      issueCount: 0,
      issueCodes: [],
    });
  });

  it("deduplicates provenance integrity issue codes in the summary", () => {
    const dependencies = createDependencies();

    const events: ResearchProvenanceEvent[] = [
      {
        id: "event-missing-investigation-1",
        investigationId: "missing-investigation",
        entityType: "Finding",
        entityId: "finding-001",
        eventType: "Created",
        timestamp: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "event-missing-investigation-2",
        investigationId: "missing-investigation",
        entityType: "Finding",
        entityId: "finding-002",
        eventType: "Created",
        timestamp: "2026-01-02T00:00:00.000Z",
      },
    ];

    dependencies.getResearchProvenanceEvents = vi.fn(
      (): ResearchProvenanceEvent[] => events,
    );

    const service =
      createResearchProvenanceIntegrityService(dependencies);

    const summary =
      service.getResearchProvenanceIntegritySummary();

    expect(summary.valid).toBe(false);
    expect(summary.checkedEventCount).toBe(2);
    expect(summary.issueCount).toBe(2);
    expect(summary.issueCodes).toEqual([
      "INVESTIGATION_NOT_FOUND",
    ]);
  });
});
