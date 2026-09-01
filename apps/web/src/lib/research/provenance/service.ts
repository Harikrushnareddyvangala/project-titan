import type {
  ResearchExperiment,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchProvenanceEvent,
  ResearchProvenanceIntegrityResult,
} from "@/types/research";

import {
  validateResearchProvenanceIntegrity as analyzeResearchProvenanceIntegrity,
} from "./integrity";

export interface ResearchProvenanceIntegrityServiceDependencies {
  getResearchProvenanceEvents(): ResearchProvenanceEvent[];
  getResearchInvestigations(): ResearchInvestigation[];
  getResearchExperiments(): ResearchExperiment[];
  getResearchFindings(): ResearchFinding[];
  getResearchFindingValidations(): ResearchFindingValidation[];
  getResearchInvestigationConclusions(): ResearchInvestigationConclusion[];
}

export interface ResearchProvenanceIntegrityService {
  validateResearchProvenanceIntegrity(): ResearchProvenanceIntegrityResult;
}

export function createResearchProvenanceIntegrityService(
  dependencies: ResearchProvenanceIntegrityServiceDependencies,
): ResearchProvenanceIntegrityService {
  const validateResearchProvenanceIntegrity =
    (): ResearchProvenanceIntegrityResult =>
      analyzeResearchProvenanceIntegrity({
        getResearchProvenanceEvents:
          dependencies.getResearchProvenanceEvents,
        getResearchInvestigations:
          dependencies.getResearchInvestigations,
        getResearchExperiments:
          dependencies.getResearchExperiments,
        getResearchFindings:
          dependencies.getResearchFindings,
        getResearchFindingValidations:
          dependencies.getResearchFindingValidations,
        getResearchInvestigationConclusions:
          dependencies.getResearchInvestigationConclusions,
      });

  return {
    validateResearchProvenanceIntegrity,
  };
}
