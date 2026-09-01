import { describe, expect, it, vi } from "vitest";

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
});
