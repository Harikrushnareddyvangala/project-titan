import type {
  ResearchEvidence,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchLineage,
  ResearchLineageIntegrityResult,
  ResearchProvenanceEvent,
  ResearchProvenanceIntegrityResult,
} from "@/types/research";

import {
  getResearchLineage as buildResearchLineage,
} from "./graph";

import {
  validateResearchLineage as analyzeResearchLineage,
} from "./integrity";

export interface ResearchLineageServiceDependencies {
  getResearchInvestigations(): ResearchInvestigation[];

  getResearchExperiments(): Array<{
    id: string;
    title: string;
    objective: string;
    status: ResearchInvestigation["status"];
    investigationId: string;
    evidenceIds: string[];
    findingIds: string[];
  }>;

  getResearchEvidence(): ResearchEvidence[];

  getResearchFindings(): ResearchFinding[];

  getResearchFindingValidations(): ResearchFindingValidation[];

  getResearchInvestigationConclusions(): ResearchInvestigationConclusion[];

  getResearchProvenanceEventsByInvestigation(
    investigationId: string,
  ): ResearchProvenanceEvent[];

  validateResearchProvenanceIntegrity():
    ResearchProvenanceIntegrityResult;
}

export interface ResearchLineageService {
  getResearchLineage(
    investigationId: string,
  ): ResearchLineage;

  validateResearchLineage(
    investigationId: string,
  ): ResearchLineageIntegrityResult;

  validateResearchLineageForInvestigation(
    investigationId: string,
  ): ResearchLineageIntegrityResult;
}

export function createResearchLineageService(
  dependencies: ResearchLineageServiceDependencies,
): ResearchLineageService {
  const getResearchLineage = (
    investigationId: string,
  ): ResearchLineage =>
    buildResearchLineage(
      investigationId,
      {
        getResearchInvestigations:
          dependencies.getResearchInvestigations,
        getResearchExperiments:
          dependencies.getResearchExperiments,
        getResearchEvidence:
          dependencies.getResearchEvidence,
        getResearchFindings:
          dependencies.getResearchFindings,
        getResearchFindingValidations:
          dependencies.getResearchFindingValidations,
        getResearchInvestigationConclusions:
          dependencies.getResearchInvestigationConclusions,
        getResearchProvenanceEventsByInvestigation:
          dependencies.getResearchProvenanceEventsByInvestigation,
        validateResearchProvenanceIntegrity:
          dependencies.validateResearchProvenanceIntegrity,
      },
    );

  const validateResearchLineage = (
    investigationId: string,
  ): ResearchLineageIntegrityResult =>
    analyzeResearchLineage(
      investigationId,
      {
        getResearchLineage,
        validateResearchProvenanceIntegrity:
          dependencies.validateResearchProvenanceIntegrity,
      },
    );

  return {
    getResearchLineage,

    validateResearchLineage,

    validateResearchLineageForInvestigation:
      validateResearchLineage,
  };
}
