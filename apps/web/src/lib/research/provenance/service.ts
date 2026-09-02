import type {
  ResearchExperiment,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchProvenanceEvent,
  ResearchProvenanceIntegrityResult,
  ResearchProvenanceIntegritySummary,
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
  getResearchProvenanceIntegritySummary(): ResearchProvenanceIntegritySummary;
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

  const getResearchProvenanceIntegritySummary =
    (): ResearchProvenanceIntegritySummary => {
      const result = validateResearchProvenanceIntegrity();

      const issueCodes = Array.from(
        new Set(result.issues.map((issue) => issue.code)),
      );

      return {
        valid: result.valid,
        checkedEventCount: result.checkedEventCount,
        issueCount: result.issues.length,
        issueCodes,
      };
    };

  return {
    validateResearchProvenanceIntegrity,
    getResearchProvenanceIntegritySummary,
  };
}
