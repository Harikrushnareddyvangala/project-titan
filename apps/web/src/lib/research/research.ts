import type {
  ResearchEvidence,
  ResearchEvidenceAssessment,
  ResearchExperiment,
  ResearchExperimentLifecycleEvent,
  ResearchFinding,
  ResearchInvestigation,
  ResearchStatus,
  ResearchFindingValidation,
  ResearchValidationDecisionResult,
  ResearchValidationStatus,
  ResearchFindingValidationHistoryEvent,
  ResearchInvestigationConclusion,
  ResearchConclusionStatus,
  ResearchProvenanceEvent,
  ResearchProvenanceEntityType,
  ResearchProvenanceEventType,
  ResearchProvenanceIntegrityIssue,
  ResearchProvenanceIntegrityResult,
} from "@/types/research";

import {
  evaluateFindingValidationEligibility,
} from "./evidenceAssessment";

const INVESTIGATION_STORAGE_KEY =
  "titan:research-investigations";

const EXPERIMENT_STORAGE_KEY =
  "titan:research-experiments";

const EVIDENCE_STORAGE_KEY =
  "titan:research-evidence";

const FINDING_STORAGE_KEY =
  "titan:research-findings";

const RESEARCH_CHANGE_EVENT =
  "titan:research-change";

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



let investigationsSnapshot: ResearchInvestigation[] = [];
let investigationsSnapshotRaw: string | null = null;

/* -------------------------------------------------------------------------- */
/*                              Utilities                                     */
/* -------------------------------------------------------------------------- */

function readCollection<T>(
  key: string,
): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value =
    localStorage.getItem(key);

  if (!value) {
    return [];
  }

  try {
    const parsed: unknown =
      JSON.parse(value);

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
    new Event(
      RESEARCH_CHANGE_EVENT,
    ),
  );
}

function createId(
  prefix: string,
): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/* -------------------------------------------------------------------------- */
/*                         Investigations                                     */
/* -------------------------------------------------------------------------- */

// export function getResearchInvestigations():
//   ResearchInvestigation[] {
//   return readCollection<ResearchInvestigation>(
//     INVESTIGATION_STORAGE_KEY,
//   );
// }
export function getResearchInvestigations():
  ResearchInvestigation[] {
  if (typeof window === "undefined") {
    return investigationsSnapshot;
  }

  const raw =
    localStorage.getItem(
      INVESTIGATION_STORAGE_KEY,
    );

  if (
    raw === investigationsSnapshotRaw
  ) {
    return investigationsSnapshot;
  }

  investigationsSnapshotRaw = raw;

  if (!raw) {
    investigationsSnapshot = [];
    return investigationsSnapshot;
  }

  try {
    const parsed: unknown =
      JSON.parse(raw);

    investigationsSnapshot =
      Array.isArray(parsed)
        ? parsed.map(
          (investigation) => ({
            ...(investigation as ResearchInvestigation),

            conclusionIds:
              Array.isArray(
                (
                  investigation as ResearchInvestigation
                ).conclusionIds,
              )
                ? (
                  investigation as ResearchInvestigation
                ).conclusionIds
                : [],
          }),
        )
        : [];
  } catch {
    investigationsSnapshot = [];
  }

  return investigationsSnapshot;
}

// export function saveResearchInvestigation(
//   investigation: ResearchInvestigation,
// ): void {
//   const investigations =
//     getResearchInvestigations();

//   const existingIndex =
//     investigations.findIndex(
//       (item) =>
//         item.id === investigation.id,
//     );

//   if (existingIndex >= 0) {
//     investigations[existingIndex] =
//       investigation;
//   } else {
//     investigations.unshift(
//       investigation,
//     );
//   }

//   writeCollection(
//     INVESTIGATION_STORAGE_KEY,
//     investigations,
//   );
// }
export function saveResearchInvestigation(
  investigation: ResearchInvestigation,
): void {
  const investigations =
    getResearchInvestigations();

  const nextInvestigations =
    [...investigations];

  const existingIndex =
    nextInvestigations.findIndex(
      (item) =>
        item.id === investigation.id,
    );

  if (existingIndex >= 0) {
    nextInvestigations[
      existingIndex
    ] = investigation;
  } else {
    nextInvestigations.unshift(
      investigation,
    );
  }

  const serialized =
    JSON.stringify(
      nextInvestigations,
    );

  investigationsSnapshot =
    nextInvestigations;

  investigationsSnapshotRaw =
    serialized;

  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    INVESTIGATION_STORAGE_KEY,
    serialized,
  );

  window.dispatchEvent(
    new Event(
      RESEARCH_CHANGE_EVENT,
    ),
  );
}

export function createResearchInvestigation(
  input: Pick<
    ResearchInvestigation,
    "title" | "objective" | "question"
  > &
    Partial<
      Pick<
        ResearchInvestigation,
        "description" | "repository"
      >
    >,
): ResearchInvestigation {
  const now =
    new Date().toISOString();

  return {
    id: createId(
      "investigation",
    ),
    title: input.title,
    objective: input.objective,
    question: input.question,
    status: "Draft",
    description:
      input.description,
    repository:
      input.repository,
    experimentIds: [],
    evidenceIds: [],
    findingIds: [],
    artifactIds: [],
    conclusionIds: [],
    createdAt: now,
    updatedAt: now,
  };
}

/* -------------------------------------------------------------------------- */
/*                    Experiment Lifecycle                                    */
/* -------------------------------------------------------------------------- */

const RESEARCH_EXPERIMENT_TRANSITIONS:
  Record<ResearchStatus, ResearchStatus[]> = {
  Draft: [
    "Investigating",
  ],

  Investigating: [
    "Evidence Collected",
  ],

  "Evidence Collected": [
    "Finding Produced",
  ],

  "Finding Produced": [
    "Validated",
  ],

  Validated: [
    "Published",
  ],

  Published: [],
};

export function canTransitionResearchExperiment(
  from: ResearchStatus,
  to: ResearchStatus,
): boolean {
  return (
    RESEARCH_EXPERIMENT_TRANSITIONS[
      from
    ]?.includes(to) ?? false
  );
}
export function transitionResearchExperiment(
  experiment: ResearchExperiment,
  to: ResearchStatus,
  reason?: string,
): ResearchExperiment | null {
  if (
    experiment.status === to
  ) {
    return experiment;
  }

  if (
    !canTransitionResearchExperiment(
      experiment.status,
      to,
    )
  ) {
    return null;
  }

  const now =
    new Date().toISOString();

  const lifecycleEvent:
    ResearchExperimentLifecycleEvent = {
    id: createId(
      "experiment-lifecycle",
    ),

    from:
      experiment.status,

    to,

    reason:
      reason?.trim() ||
      undefined,

    timestamp: now,
  };

  const updatedExperiment:
    ResearchExperiment = {
    ...experiment,

    status: to,

    lifecycle: [
      ...experiment.lifecycle,
      lifecycleEvent,
    ],

    updatedAt: now,
  };

  saveResearchExperiment(
    updatedExperiment,
  );

  createResearchProvenanceEvent({
    investigationId:
      experiment.investigationId,

    entityType: "Experiment",

    entityId:
      experiment.id,

    eventType:
      "StatusChanged",

    fromStatus:
      experiment.status,

    toStatus:
      to,

    reason:
      reason?.trim() ||
      undefined,
  });

  return updatedExperiment;
}
const RESEARCH_CONCLUSION_TRANSITIONS: Record<
  ResearchConclusionStatus,
  ResearchConclusionStatus[]
> = {
  Draft: [
    "Proposed",
  ],

  Proposed: [
    "Accepted",
    "Draft",
  ],

  Accepted: [
    "Superseded",
  ],

  Superseded: [],
};

export function canTransitionResearchInvestigationConclusion(
  from: ResearchConclusionStatus,
  to: ResearchConclusionStatus,
): boolean {
  return (
    RESEARCH_CONCLUSION_TRANSITIONS[
      from
    ]?.includes(to) ?? false
  );
}

export interface ResearchConclusionAcceptanceResult {
  eligible: boolean;
  reasons: string[];
  supportingFindingCount: number;
  validatedFindingCount: number;
}

export function evaluateResearchInvestigationConclusionAcceptance(
  conclusion: ResearchInvestigationConclusion,
): ResearchConclusionAcceptanceResult {
  const reasons: string[] = [];

  const findings =
    getResearchFindings();

  const validations =
    getResearchFindingValidations();

  const supportingFindingCount =
    conclusion.supportingFindingIds.length;

  if (
    supportingFindingCount === 0
  ) {
    reasons.push(
      "At least one supporting finding is required.",
    );

    return {
      eligible: false,
      reasons,
      supportingFindingCount: 0,
      validatedFindingCount: 0,
    };
  }

  let validatedFindingCount = 0;

  for (
    const findingId of
    conclusion.supportingFindingIds
  ) {
    const finding =
      findings.find(
        (item) =>
          item.id === findingId,
      );

    if (!finding) {
      reasons.push(
        `Supporting finding ${findingId} was not found.`,
      );

      continue;
    }

    const validated =
      finding.validationIds.some(
        (validationId) => {
          const validation =
            validations.find(
              (item) =>
                item.id ===
                validationId,
            );

          return (
            validation?.status ===
            "Validated"
          );
        },
      );

    if (validated) {
      validatedFindingCount += 1;
    } else {
      reasons.push(
        `Supporting finding "${finding.statement}" has not been validated.`,
      );
    }
  }

  return {
    eligible:
      reasons.length === 0,

    reasons,

    supportingFindingCount,

    validatedFindingCount,
  };
}

export function transitionResearchInvestigationConclusion(
  conclusion: ResearchInvestigationConclusion,
  to: ResearchConclusionStatus,
): ResearchInvestigationConclusion | null {
  if (
    conclusion.status === to
  ) {
    return conclusion;
  }

  if (
    !canTransitionResearchInvestigationConclusion(
      conclusion.status,
      to,
    )
  ) {
    return null;
  }

  if (to === "Accepted") {
    const acceptance =
      evaluateResearchInvestigationConclusionAcceptance(
        conclusion,
      );

    if (!acceptance.eligible) {
      return null;
    }
  }

  const updatedConclusion:
    ResearchInvestigationConclusion = {
    ...conclusion,

    status: to,

    updatedAt:
      new Date().toISOString(),
  };

  saveResearchInvestigationConclusion(
    updatedConclusion,
  );

  createResearchProvenanceEvent({
    investigationId:
      conclusion.investigationId,

    entityType:
      "Conclusion",

    entityId:
      conclusion.id,

    eventType:
      to === "Accepted"
        ? "Accepted"
        : to === "Superseded"
          ? "Superseded"
          : "StatusChanged",

    fromStatus:
      conclusion.status,

    toStatus:
      to,
  });

  return updatedConclusion;
}
/* -------------------------------------------------------------------------- */
/*                              Experiments                                   */
/* -------------------------------------------------------------------------- */

export function getResearchExperiments():
  ResearchExperiment[] {
  const stored =
    readCollection<
      ResearchExperiment & {
        lifecycle?: ResearchExperimentLifecycleEvent[];
      }
    >(
      EXPERIMENT_STORAGE_KEY,
    );

  return stored.map(
    (experiment) => ({
      ...experiment,

      lifecycle:
        experiment.lifecycle ??
        [],
    }),
  );
}

export function saveResearchExperiment(
  experiment: ResearchExperiment,
): void {
  const experiments =
    getResearchExperiments();

  const existingIndex =
    experiments.findIndex(
      (item) =>
        item.id === experiment.id,
    );

  if (existingIndex >= 0) {
    experiments[existingIndex] =
      experiment;
  } else {
    experiments.unshift(
      experiment,
    );
  }

  writeCollection(
    EXPERIMENT_STORAGE_KEY,
    experiments,
  );
}

/* -------------------------------------------------------------------------- */
/*                               Evidence                                     */
/* -------------------------------------------------------------------------- */

export function getResearchEvidence():
  ResearchEvidence[] {
  return readCollection<ResearchEvidence>(
    EVIDENCE_STORAGE_KEY,
  );
}

export function saveResearchEvidence(
  evidence: ResearchEvidence,
): void {
  const collection =
    getResearchEvidence();

  const existingIndex =
    collection.findIndex(
      (item) =>
        item.id === evidence.id,
    );

  if (existingIndex >= 0) {
    collection[existingIndex] =
      evidence;
  } else {
    collection.unshift(evidence);
  }

  writeCollection(
    EVIDENCE_STORAGE_KEY,
    collection,
  );
}
function normalizeResearchFinding(
  raw: ResearchFinding & {
    evidenceIds?: string[];
    validationIds?: string[];
  },
): ResearchFinding {
  const now =
    raw.updatedAt ??
    raw.createdAt ??
    new Date().toISOString();

  if (
    Array.isArray(
      raw.evidenceAssessments,
    )
  ) {
    return {
      ...raw,

      validationIds:
        raw.validationIds ?? [],

      createdAt:
        raw.createdAt ?? now,

      updatedAt:
        raw.updatedAt ?? now,
    };
  }

  const evidenceAssessments =
    (raw.evidenceIds ?? []).map(
      (evidenceId) => ({
        id: createId(
          "evidence-assessment",
        ),

        evidenceId,

        type:
          "Supporting" as const,

        relevance: 0.5,

        supportStrength: 0.5,

        reliability: 0.5,

        independence: 0.5,

        rationale:
          "Migrated from the previous evidence relationship model.",

        assessedAt: now,

        updatedAt: now,
      }),
    );

  return {
    id: raw.id,

    statement: raw.statement,

    evidenceAssessments,

    confidence:
      raw.confidence,

    validationIds:
      raw.validationIds ?? [],

    createdAt:
      raw.createdAt ?? now,

    updatedAt:
      raw.updatedAt ?? now,
  };
}

/* -------------------------------------------------------------------------- */
/*                               Findings                                     */
/* -------------------------------------------------------------------------- */

export function getResearchFindings():
  ResearchFinding[] {
  const raw =
    readCollection<
      ResearchFinding & {
        evidenceIds?: string[];
      }
    >(FINDING_STORAGE_KEY);

  return raw.map(
    normalizeResearchFinding,
  );
}

export function saveResearchFinding(
  finding: ResearchFinding,
): void {
  const findings =
    getResearchFindings();

  const existingIndex =
    findings.findIndex(
      (item) =>
        item.id === finding.id,
    );

  if (existingIndex >= 0) {
    findings[existingIndex] =
      finding;
  } else {
    findings.unshift(finding);
  }

  writeCollection(
    FINDING_STORAGE_KEY,
    findings,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Finding Validation                                 */
/* -------------------------------------------------------------------------- */

export function getResearchFindingValidations():
  ResearchFindingValidation[] {
  return readCollection<ResearchFindingValidation>(
    FINDING_VALIDATION_STORAGE_KEY,
  );
}

export function saveResearchFindingValidation(
  validation: ResearchFindingValidation,
): void {
  const validations =
    getResearchFindingValidations();

  const existingIndex =
    validations.findIndex(
      (item) =>
        item.id === validation.id,
    );

  if (existingIndex >= 0) {
    validations[existingIndex] =
      validation;
  } else {
    validations.unshift(
      validation,
    );
  }

  writeCollection(
    FINDING_VALIDATION_STORAGE_KEY,
    validations,
  );
}
/* -------------------------------------------------------------------------- */
/*                Finding Validation History                                  */
/* -------------------------------------------------------------------------- */

export function getResearchFindingValidationHistory():
  ResearchFindingValidationHistoryEvent[] {
  return readCollection<ResearchFindingValidationHistoryEvent>(
    FINDING_VALIDATION_HISTORY_STORAGE_KEY,
  );
}

export function saveResearchFindingValidationHistoryEvent(
  event: ResearchFindingValidationHistoryEvent,
): void {
  const history =
    getResearchFindingValidationHistory();

  const alreadyExists =
    history.some(
      (item) =>
        item.id === event.id,
    );

  if (alreadyExists) {
    return;
  }

  history.unshift(event);

  writeCollection(
    FINDING_VALIDATION_HISTORY_STORAGE_KEY,
    history,
  );
}
/* -------------------------------------------------------------------------- */
/*                    Finding Validation Lifecycle                            */
/* -------------------------------------------------------------------------- */

const RESEARCH_FINDING_VALIDATION_TRANSITIONS:
  Record<
    ResearchValidationStatus,
    ResearchValidationStatus[]
  > = {
  Pending: [
    "In Review",
  ],

  "In Review": [
    "Validated",
    "Rejected",
    "Needs Revision",
  ],

  Validated: [],

  Rejected: [],

  "Needs Revision": [],
};

export function canTransitionResearchFindingValidation(
  from: ResearchValidationStatus,
  to: ResearchValidationStatus,
): boolean {
  if (from === to) {
    return true;
  }

  return (
    RESEARCH_FINDING_VALIDATION_TRANSITIONS[
      from
    ]?.includes(to) ?? false
  );
}
export function transitionResearchFindingValidation(
  validationId: string,
  to: ResearchValidationStatus,
  reason?: string,
): ResearchFindingValidation | null {
  const validations =
    getResearchFindingValidations();

  const validation =
    validations.find(
      (item) =>
        item.id === validationId,
    );

  if (!validation) {
    return null;
  }

  if (
    validation.status === to
  ) {
    return validation;
  }

  if (
    !canTransitionResearchFindingValidation(
      validation.status,
      to,
    )
  ) {
    return null;
  }
  const normalizedReason =
    reason?.trim();

  if (
    (
      to === "Validated" ||
      to === "Rejected" ||
      to === "Needs Revision"
    ) &&
    !normalizedReason
  ) {
    return null;
  }

  const now =
    new Date().toISOString();

  const updatedValidation:
    ResearchFindingValidation = {
    ...validation,

    status: to,

    decision:
      to === "Validated"
        ? "Accept"
        : to === "Rejected"
          ? "Reject"
          : to ===
            "Needs Revision"
            ? "Revise"
            : validation.decision,

    rationale:
      normalizedReason ||
      validation.rationale,

    updatedAt: now,

    validatedAt:
      to === "Validated"
        ? now
        : validation.validatedAt,
  };

  saveResearchFindingValidation(
    updatedValidation,
  );
  const historyEvent:
    ResearchFindingValidationHistoryEvent = {
    id: createId(
      "finding-validation-history",
    ),

    validationId:
      updatedValidation.id,

    from:
      validation.status,

    to,

    decision:
      updatedValidation.decision,

    reason:
      normalizedReason,

    timestamp: now,
  };

  saveResearchFindingValidationHistoryEvent(
    historyEvent,
  );

  const investigations =
    getResearchInvestigations();

  const finding =
    getResearchFindings().find(
      (item) =>
        item.id ===
        updatedValidation.findingId,
    );

  const investigation =
    finding
      ? investigations.find(
        (item) =>
          item.findingIds.includes(
            finding.id,
          ),
      )
      : undefined;

  if (investigation) {
    createResearchProvenanceEvent({
      investigationId:
        investigation.id,

      entityType:
        "FindingValidation",

      entityId:
        updatedValidation.id,

      eventType:
        to === "Validated"
          ? "Validated"
          : to === "Rejected"
            ? "Rejected"
            : to ===
              "Needs Revision"
              ? "RevisionRequested"
              : "StatusChanged",

      fromStatus:
        validation.status,

      toStatus:
        to,

      reason:
        normalizedReason,
    });
  }

  return updatedValidation;
}


export function createResearchFindingValidation(
  findingId: string,
  input: Omit<
    ResearchFindingValidation,
    | "id"
    | "findingId"
    | "createdAt"
    | "updatedAt"
    | "validatedAt"
    | "confidenceAtValidation"
    | "evidenceAssessmentCount"
    | "supportingEvidenceCount"
    | "contradictingEvidenceCount"
  >,
): ResearchValidationDecisionResult {
  const findings =
    getResearchFindings();

  const finding =
    findings.find(
      (item) =>
        item.id === findingId,
    );

  if (!finding) {
    return {
      success: false,
      finding: null,
      validation: null,
      reasons: [
        "Finding was not found.",
      ],
    };
  }
  const eligibility =
    evaluateFindingValidationEligibility(
      finding.evidenceAssessments,
      finding.confidence,
    );

  if (!eligibility.eligible) {
    return {
      success: false,
      finding,
      validation: null,
      reasons:
        eligibility.reasons,
    };
  }

  const now =
    new Date().toISOString();

  const supportingEvidenceCount =
    finding.evidenceAssessments.filter(
      (assessment) =>
        assessment.type ===
        "Supporting",
    ).length;

  const contradictingEvidenceCount =
    finding.evidenceAssessments.filter(
      (assessment) =>
        assessment.type ===
        "Contradicting",
    ).length;

  const validation:
    ResearchFindingValidation = {
    ...input,

    id: createId(
      "finding-validation",
    ),

    findingId,

    confidenceAtValidation:
      finding.confidence,

    evidenceAssessmentCount:
      finding.evidenceAssessments
        .length,

    supportingEvidenceCount,

    contradictingEvidenceCount,

    createdAt: now,

    updatedAt: now,

    validatedAt:
      input.status ===
        "Validated"
        ? now
        : undefined,
  };

  saveResearchFindingValidation(
    validation,
  );

  const updatedFinding:
    ResearchFinding = {
    ...finding,

    validationIds: [
      ...finding.validationIds,
      validation.id,
    ],

    updatedAt: now,
  };

  saveResearchFinding(
    updatedFinding,
  );

  return {
    success: true,
    finding: updatedFinding,
    validation,
    reasons: [],
  };
}


/* -------------------------------------------------------------------------- */
/*                    Investigation Conclusions                              */
/* -------------------------------------------------------------------------- */

export function getResearchInvestigationConclusions():
  ResearchInvestigationConclusion[] {
  const stored =
    readCollection<
      ResearchInvestigationConclusion & {
        supportingFindingIds?: string[];
        contradictingFindingIds?: string[];
      }
    >(
      INVESTIGATION_CONCLUSION_STORAGE_KEY,
    );

  return stored.map(
    (conclusion) => ({
      ...conclusion,

      supportingFindingIds:
        Array.isArray(
          conclusion.supportingFindingIds,
        )
          ? conclusion.supportingFindingIds
          : [],

      contradictingFindingIds:
        Array.isArray(
          conclusion.contradictingFindingIds,
        )
          ? conclusion.contradictingFindingIds
          : [],
    }),
  );
}

export function saveResearchInvestigationConclusion(
  conclusion: ResearchInvestigationConclusion,
): void {
  const conclusions =
    getResearchInvestigationConclusions();

  const existingIndex =
    conclusions.findIndex(
      (item) =>
        item.id === conclusion.id,
    );

  if (existingIndex >= 0) {
    conclusions[existingIndex] =
      conclusion;
  } else {
    conclusions.unshift(
      conclusion,
    );
  }

  writeCollection(
    INVESTIGATION_CONCLUSION_STORAGE_KEY,
    conclusions,
  );
}


export function createResearchInvestigationConclusion(
  input: Omit<
    ResearchInvestigationConclusion,
    | "id"
    | "createdAt"
    | "updatedAt"
  >,
): ResearchInvestigationConclusion {
  const now =
    new Date().toISOString();

  const conclusion:
    ResearchInvestigationConclusion = {
    ...input,

    id: createId(
      "investigation-conclusion",
    ),

    createdAt: now,

    updatedAt: now,
  };

  saveResearchInvestigationConclusion(
    conclusion,
  );

  return conclusion;
}

export function attachResearchInvestigationConclusion(
  investigationId: string,
  conclusionId: string,
): ResearchInvestigation | null {
  const investigations =
    getResearchInvestigations();

  const investigationIndex =
    investigations.findIndex(
      (item) =>
        item.id === investigationId,
    );

  if (investigationIndex < 0) {
    return null;
  }

  const conclusion =
    getResearchInvestigationConclusions().find(
      (item) =>
        item.id === conclusionId,
    );

  if (!conclusion) {
    return null;
  }

  if (
    conclusion.investigationId !==
    investigationId
  ) {
    return null;
  }

  const investigation =
    investigations[
    investigationIndex
    ];

  if (
    investigation.conclusionIds.includes(
      conclusionId,
    )
  ) {
    return investigation;
  }

  const updatedInvestigation:
    ResearchInvestigation = {
    ...investigation,

    conclusionIds: [
      ...investigation.conclusionIds,
      conclusionId,
    ],

    updatedAt:
      new Date().toISOString(),
  };

  investigations[
    investigationIndex
  ] = updatedInvestigation;

  saveResearchInvestigation(
    updatedInvestigation,
  );

  return updatedInvestigation;
}

export function detachResearchInvestigationConclusion(
  investigationId: string,
  conclusionId: string,
): ResearchInvestigation | null {
  const investigations =
    getResearchInvestigations();

  const investigationIndex =
    investigations.findIndex(
      (item) =>
        item.id === investigationId,
    );

  if (investigationIndex < 0) {
    return null;
  }

  const investigation =
    investigations[
    investigationIndex
    ];

  if (
    !investigation.conclusionIds.includes(
      conclusionId,
    )
  ) {
    return investigation;
  }

  const updatedInvestigation:
    ResearchInvestigation = {
    ...investigation,

    conclusionIds:
      investigation.conclusionIds.filter(
        (id) =>
          id !== conclusionId,
      ),

    updatedAt:
      new Date().toISOString(),
  };

  investigations[
    investigationIndex
  ] = updatedInvestigation;

  saveResearchInvestigation(
    updatedInvestigation,
  );

  return updatedInvestigation;
}
export function createResearchEvidenceAssessment(
  input: Omit<
    ResearchEvidenceAssessment,
    "id" | "assessedAt" | "updatedAt"
  >,
): ResearchEvidenceAssessment {
  const now = new Date().toISOString();

  return {
    ...input,
    id: createId("evidence-assessment"),
    assessedAt: now,
    updatedAt: now,
  };
}

export function updateResearchFindingEvidenceAssessment(
  findingId: string,
  assessment: ResearchEvidenceAssessment,
): ResearchFinding | null {
  const findings =
    getResearchFindings();

  const findingIndex =
    findings.findIndex(
      (finding) =>
        finding.id === findingId,
    );

  if (findingIndex < 0) {
    return null;
  }

  const finding = findings[findingIndex];

  const existingAssessmentIndex =
    finding.evidenceAssessments.findIndex(
      (item) =>
        item.id === assessment.id,
    );

  const evidenceAssessments = [
    ...finding.evidenceAssessments,
  ];

  if (
    existingAssessmentIndex >= 0
  ) {
    evidenceAssessments[
      existingAssessmentIndex
    ] = assessment;
  } else {
    evidenceAssessments.push(
      assessment,
    );
  }

  const updatedFinding: ResearchFinding = {
    ...finding,
    evidenceAssessments,
    updatedAt:
      new Date().toISOString(),
  };

  saveResearchFinding(
    updatedFinding,
  );

  return updatedFinding;
}

export function removeResearchFindingEvidenceAssessment(
  findingId: string,
  assessmentId: string,
): ResearchFinding | null {
  const findings =
    getResearchFindings();

  const finding =
    findings.find(
      (item) =>
        item.id === findingId,
    );

  if (!finding) {
    return null;
  }

  const updatedFinding: ResearchFinding = {
    ...finding,
    evidenceAssessments:
      finding.evidenceAssessments.filter(
        (assessment) =>
          assessment.id !==
          assessmentId,
      ),
    updatedAt:
      new Date().toISOString(),
  };

  saveResearchFinding(
    updatedFinding,
  );

  return updatedFinding;
}
/* -------------------------------------------------------------------------- */
/*                         Research Provenance                                */
/* -------------------------------------------------------------------------- */

export function getResearchProvenanceEvents():
  ResearchProvenanceEvent[] {
  return readCollection<ResearchProvenanceEvent>(
    RESEARCH_PROVENANCE_STORAGE_KEY,
  );
}

export function getResearchProvenanceEventsByInvestigation(
  investigationId: string,
): ResearchProvenanceEvent[] {
  return getResearchProvenanceEvents().filter(
    (event) =>
      event.investigationId ===
      investigationId,
  );
}

export function getResearchProvenanceEventsByEntity(
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent[] {
  return getResearchProvenanceEvents().filter(
    (event) =>
      event.entityType === entityType &&
      event.entityId === entityId,
  );
}

export function getResearchProvenanceEventsByInvestigationAndEntity(
  investigationId: string,
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent[] {
  return getResearchProvenanceEvents().filter(
    (event) =>
      event.investigationId ===
      investigationId &&
      event.entityType === entityType &&
      event.entityId === entityId,
  );
}

export function getResearchProvenanceEventsChronological():
  ResearchProvenanceEvent[] {
  return [
    ...getResearchProvenanceEvents(),
  ].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() -
      new Date(b.timestamp).getTime(),
  );
}

export function getResearchProvenanceEventsByInvestigationChronological(
  investigationId: string,
): ResearchProvenanceEvent[] {
  return getResearchProvenanceEventsByInvestigation(
    investigationId,
  ).sort(
    (a, b) =>
      new Date(a.timestamp).getTime() -
      new Date(b.timestamp).getTime(),
  );
}

export function getLatestResearchProvenanceEvent(
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent | null {
  const events =
    getResearchProvenanceEventsByEntity(
      entityType,
      entityId,
    );

  if (events.length === 0) {
    return null;
  }

  return events.reduce(
    (latest, event) =>
      new Date(event.timestamp).getTime() >
        new Date(latest.timestamp).getTime()
        ? event
        : latest,
  );
}

export function getResearchProvenanceEventsByEventType(
  eventType: ResearchProvenanceEventType,
): ResearchProvenanceEvent[] {
  return getResearchProvenanceEvents().filter(
    (event) =>
      event.eventType === eventType,
  );
}

export function validateResearchProvenanceIntegrity():
  ResearchProvenanceIntegrityResult {
  const events =
    getResearchProvenanceEvents();

  const investigations =
    getResearchInvestigations();

  const experiments =
    getResearchExperiments();

  const findings =
    getResearchFindings();

  const validations =
    getResearchFindingValidations();

  const conclusions =
    getResearchInvestigationConclusions();

  const issues:
    ResearchProvenanceIntegrityIssue[] = [];

  const addIssue = (
    event: ResearchProvenanceEvent,
    code: string,
    message: string,
  ): void => {
    issues.push({
      eventId: event.id,
      investigationId:
        event.investigationId,
      entityType:
        event.entityType,
      entityId:
        event.entityId,
      code,
      message,
    });
  };

  for (const event of events) {
    const investigation =
      investigations.find(
        (item) =>
          item.id ===
          event.investigationId,
      );

    if (!investigation) {
      addIssue(
        event,
        "INVESTIGATION_NOT_FOUND",
        `Investigation ${event.investigationId} was not found.`,
      );

      continue;
    }

    const timestamp =
      new Date(event.timestamp).getTime();

    if (Number.isNaN(timestamp)) {
      addIssue(
        event,
        "INVALID_TIMESTAMP",
        `Provenance event ${event.id} has an invalid timestamp.`,
      );
    }

    switch (event.entityType) {
      case "Investigation": {
        if (
          event.entityId !==
          investigation.id
        ) {
          addIssue(
            event,
            "ENTITY_INVESTIGATION_MISMATCH",
            `Event entity ${event.entityId} does not match investigation ${investigation.id}.`,
          );
        }

        break;
      }

      case "Experiment": {
        const experiment =
          experiments.find(
            (item) =>
              item.id ===
              event.entityId,
          );

        if (!experiment) {
          addIssue(
            event,
            "EXPERIMENT_NOT_FOUND",
            `Experiment ${event.entityId} was not found.`,
          );

          break;
        }

        if (
          experiment.investigationId !==
          investigation.id
        ) {
          addIssue(
            event,
            "EXPERIMENT_INVESTIGATION_MISMATCH",
            `Experiment ${event.entityId} does not belong to investigation ${investigation.id}.`,
          );
        }

        break;
      }

      case "FindingValidation": {
        const validation =
          validations.find(
            (item) =>
              item.id ===
              event.entityId,
          );

        if (!validation) {
          addIssue(
            event,
            "VALIDATION_NOT_FOUND",
            `Finding validation ${event.entityId} was not found.`,
          );

          break;
        }

        const finding =
          findings.find(
            (item) =>
              item.id ===
              validation.findingId,
          );

        if (!finding) {
          addIssue(
            event,
            "VALIDATION_FINDING_NOT_FOUND",
            `Finding ${validation.findingId} referenced by validation ${validation.id} was not found.`,
          );

          break;
        }

        if (
          !investigation.findingIds.includes(
            finding.id,
          )
        ) {
          addIssue(
            event,
            "FINDING_INVESTIGATION_MISMATCH",
            `Finding ${finding.id} does not belong to investigation ${investigation.id}.`,
          );
        }

        break;
      }

      case "Conclusion": {
        const conclusion =
          conclusions.find(
            (item) =>
              item.id ===
              event.entityId,
          );

        if (!conclusion) {
          addIssue(
            event,
            "CONCLUSION_NOT_FOUND",
            `Conclusion ${event.entityId} was not found.`,
          );

          break;
        }

        if (
          conclusion.investigationId !==
          investigation.id
        ) {
          addIssue(
            event,
            "CONCLUSION_INVESTIGATION_MISMATCH",
            `Conclusion ${event.entityId} does not belong to investigation ${investigation.id}.`,
          );
        }

        break;
      }

      case "Evidence":
      case "EvidenceAssessment":
      case "Finding":
        break;
    }
  }

  return {
    valid:
      issues.length === 0,
    checkedEventCount:
      events.length,
    issues,
  };
}

export function saveResearchProvenanceEvent(
  event: ResearchProvenanceEvent,
): void {
  const events =
    getResearchProvenanceEvents();

  const alreadyExists =
    events.some(
      (item) =>
        item.id === event.id,
    );

  if (alreadyExists) {
    return;
  }

  events.unshift(event);

  writeCollection(
    RESEARCH_PROVENANCE_STORAGE_KEY,
    events,
  );
}

export function createResearchProvenanceEvent(
  input: Omit<
    ResearchProvenanceEvent,
    "id" | "timestamp"
  >,
): ResearchProvenanceEvent {
  const event: ResearchProvenanceEvent = {
    ...input,

    id: createId(
      "research-provenance",
    ),

    timestamp:
      new Date().toISOString(),
  };

  saveResearchProvenanceEvent(
    event,
  );

  return event;
}
/* -------------------------------------------------------------------------- */
/*                              Subscription                                  */
/* -------------------------------------------------------------------------- */

export function subscribeToResearch(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => { };
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
}
