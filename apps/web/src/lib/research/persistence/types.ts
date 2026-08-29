import type {
  ResearchEvidence,
  ResearchEvidenceAssessment,
  ResearchExperiment,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchFindingValidationHistoryEvent,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchProvenanceEvent,
} from "@/types/research";

export interface ResearchPersistenceSnapshot {
  investigations: ResearchInvestigation[];
  experiments: ResearchExperiment[];
  evidence: ResearchEvidence[];
  evidenceAssessments: ResearchEvidenceAssessment[];
  findings: ResearchFinding[];
  findingValidations: ResearchFindingValidation[];
  findingValidationHistory: ResearchFindingValidationHistoryEvent[];
  investigationConclusions: ResearchInvestigationConclusion[];
  provenanceEvents: ResearchProvenanceEvent[];
}

export interface ResearchPersistence {
  load(): ResearchPersistenceSnapshot;

  saveInvestigations(
    investigations: ResearchInvestigation[],
  ): void;

  saveExperiments(
    experiments: ResearchExperiment[],
  ): void;

  saveEvidence(
    evidence: ResearchEvidence[],
  ): void;

  saveEvidenceAssessments(
    assessments: ResearchEvidenceAssessment[],
  ): void;

  saveFindings(
    findings: ResearchFinding[],
  ): void;

  saveFindingValidations(
    validations: ResearchFindingValidation[],
  ): void;

  saveFindingValidationHistory(
    history: ResearchFindingValidationHistoryEvent[],
  ): void;

  saveInvestigationConclusions(
    conclusions: ResearchInvestigationConclusion[],
  ): void;

  saveProvenanceEvents(
    events: ResearchProvenanceEvent[],
  ): void;

  getSnapshotKey(): string | null;

  getCollectionSnapshotKey(
    collection:
      | "investigations"
      | "experiments"
      | "evidence"
      | "evidenceAssessments"
      | "findings"
      | "findingValidations"
      | "findingValidationHistory"
      | "investigationConclusions"
      | "provenanceEvents",
  ): string | null;

  subscribe(
    callback: () => void,
  ): () => void;
}
