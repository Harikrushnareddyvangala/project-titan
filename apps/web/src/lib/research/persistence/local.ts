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

import type {
  ResearchPersistence,
  ResearchPersistenceSnapshot,
} from "./types";

const INVESTIGATION_STORAGE_KEY = "titan:research-investigations";
const EXPERIMENT_STORAGE_KEY = "titan:research-experiments";
const EVIDENCE_STORAGE_KEY = "titan:research-evidence";
const FINDING_STORAGE_KEY = "titan:research-findings";
const EVIDENCE_ASSESSMENT_STORAGE_KEY =
  "titan:research-evidence-assessments";
const FINDING_VALIDATION_STORAGE_KEY =
  "titan:research-finding-validations";
const INVESTIGATION_CONCLUSION_STORAGE_KEY =
  "titan:research-investigation-conclusions";
const FINDING_VALIDATION_HISTORY_STORAGE_KEY =
  "titan:research-finding-validation-history";
const RESEARCH_PROVENANCE_STORAGE_KEY =
  "titan:research-provenance-events";

const RESEARCH_CHANGE_EVENT = "titan:research-change";

function readCollection<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value = localStorage.getItem(key);

  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    return Array.isArray(parsed)
      ? (parsed as T[])
      : [];
  } catch {
    return [];
  }
}

function writeCollection<T>(
  key: string,
  value: T[],
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    key,
    JSON.stringify(value),
  );

  window.dispatchEvent(
    new Event(RESEARCH_CHANGE_EVENT),
  );
}

function getSnapshotKey(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return [
    localStorage.getItem(
      INVESTIGATION_STORAGE_KEY,
    ),
    localStorage.getItem(
      EXPERIMENT_STORAGE_KEY,
    ),
    localStorage.getItem(
      EVIDENCE_STORAGE_KEY,
    ),
    localStorage.getItem(
      FINDING_STORAGE_KEY,
    ),
    localStorage.getItem(
      EVIDENCE_ASSESSMENT_STORAGE_KEY,
    ),
    localStorage.getItem(
      FINDING_VALIDATION_STORAGE_KEY,
    ),
    localStorage.getItem(
      INVESTIGATION_CONCLUSION_STORAGE_KEY,
    ),
    localStorage.getItem(
      FINDING_VALIDATION_HISTORY_STORAGE_KEY,
    ),
    localStorage.getItem(
      RESEARCH_PROVENANCE_STORAGE_KEY,
    ),
  ].join("|");
}

function getCollectionSnapshotKey(
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
): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const keys = {
    investigations:
      INVESTIGATION_STORAGE_KEY,

    experiments:
      EXPERIMENT_STORAGE_KEY,

    evidence:
      EVIDENCE_STORAGE_KEY,

    evidenceAssessments:
      EVIDENCE_ASSESSMENT_STORAGE_KEY,

    findings:
      FINDING_STORAGE_KEY,

    findingValidations:
      FINDING_VALIDATION_STORAGE_KEY,

    findingValidationHistory:
      FINDING_VALIDATION_HISTORY_STORAGE_KEY,

    investigationConclusions:
      INVESTIGATION_CONCLUSION_STORAGE_KEY,

    provenanceEvents:
      RESEARCH_PROVENANCE_STORAGE_KEY,
  } as const;

  return localStorage.getItem(
    keys[collection],
  );
}
function load(): ResearchPersistenceSnapshot {
  return {
    investigations:
      readCollection<ResearchInvestigation>(
        INVESTIGATION_STORAGE_KEY,
      ),

    experiments:
      readCollection<ResearchExperiment>(
        EXPERIMENT_STORAGE_KEY,
      ),

    evidence:
      readCollection<ResearchEvidence>(
        EVIDENCE_STORAGE_KEY,
      ),

    evidenceAssessments:
      readCollection<ResearchEvidenceAssessment>(
        EVIDENCE_ASSESSMENT_STORAGE_KEY,
      ),

    findings:
      readCollection<ResearchFinding>(
        FINDING_STORAGE_KEY,
      ),

    findingValidations:
      readCollection<ResearchFindingValidation>(
        FINDING_VALIDATION_STORAGE_KEY,
      ),

    findingValidationHistory:
      readCollection<ResearchFindingValidationHistoryEvent>(
        FINDING_VALIDATION_HISTORY_STORAGE_KEY,
      ),

    investigationConclusions:
      readCollection<ResearchInvestigationConclusion>(
        INVESTIGATION_CONCLUSION_STORAGE_KEY,
      ),

    provenanceEvents:
      readCollection<ResearchProvenanceEvent>(
        RESEARCH_PROVENANCE_STORAGE_KEY,
      ),
  };
}

export const localResearchPersistence:
  ResearchPersistence = {
  load,

  saveInvestigations(
    investigations,
  ) {
    writeCollection(
      INVESTIGATION_STORAGE_KEY,
      investigations,
    );
  },

  saveExperiments(
    experiments,
  ) {
    writeCollection(
      EXPERIMENT_STORAGE_KEY,
      experiments,
    );
  },

  saveEvidence(
    evidence,
  ) {
    writeCollection(
      EVIDENCE_STORAGE_KEY,
      evidence,
    );
  },

  saveEvidenceAssessments(
    assessments,
  ) {
    writeCollection(
      EVIDENCE_ASSESSMENT_STORAGE_KEY,
      assessments,
    );
  },

  saveFindings(
    findings,
  ) {
    writeCollection(
      FINDING_STORAGE_KEY,
      findings,
    );
  },

  saveFindingValidations(
    validations,
  ) {
    writeCollection(
      FINDING_VALIDATION_STORAGE_KEY,
      validations,
    );
  },

  saveFindingValidationHistory(
    history,
  ) {
    writeCollection(
      FINDING_VALIDATION_HISTORY_STORAGE_KEY,
      history,
    );
  },

  saveInvestigationConclusions(
    conclusions,
  ) {
    writeCollection(
      INVESTIGATION_CONCLUSION_STORAGE_KEY,
      conclusions,
    );
  },

  saveProvenanceEvents(
    events,
  ) {
    writeCollection(
      RESEARCH_PROVENANCE_STORAGE_KEY,
      events,
    );
  },

  getSnapshotKey,

  getCollectionSnapshotKey,

  subscribe(callback) {
    if (typeof window === "undefined") {
      return () => {};
    }

    const handleChange = () => {
      callback();
    };

    window.addEventListener(
      "storage",
      handleChange,
    );

    window.addEventListener(
      RESEARCH_CHANGE_EVENT,
      handleChange,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleChange,
      );

      window.removeEventListener(
        RESEARCH_CHANGE_EVENT,
        handleChange,
      );
    };
  },
};
