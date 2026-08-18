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
  ResearchProvenanceTimelineItem,
  ResearchProvenanceEntityType,
  ResearchProvenanceEventType,
  ResearchProvenanceIntegrityIssue,
  ResearchProvenanceIntegrityResult,
  ResearchProvenanceIntegritySummary,
  ResearchProvenanceInvestigationSummary,
  ResearchLineage,
  ResearchLineageEdge,
  ResearchLineageEdgeType,
  ResearchLineageNode,
  ResearchLineageNodeType,
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityResult,
  ResearchLineageIntegrityCategory,
  ResearchLineageIntegrityPriority,
  ResearchLineageIntegrityPrioritySummary,
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

export function getResearchProvenanceTimeline():
  ResearchProvenanceTimelineItem[] {
  return getResearchProvenanceEventsChronological().map(
    (event) => {
      const validation =
        event.entityType === "FindingValidation"
          ? getResearchFindingValidations().find(
            (item) =>
              item.id === event.entityId,
          )
          : undefined;

      const finding =
        validation
          ? getResearchFindings().find(
            (item) =>
              item.id === validation.findingId,
          )
          : undefined;

      const statusDescription =
        event.fromStatus &&
          event.toStatus
          ? `${event.fromStatus} → ${event.toStatus}`
          : undefined;

      return {
        eventId: event.id,

        investigationId:
          event.investigationId,

        entityType:
          event.entityType,

        findingId:
          finding?.id,

        findingStatement:
          finding?.statement,

        validationId:
          validation?.id,

        validator:
          validation?.validator,

        decision:
          validation?.decision,

        entityId:
          event.entityId,

        eventType:
          event.eventType,

        title:
          `${event.entityType} ${event.eventType}`,

        description:
          statusDescription ??
          event.reason ??
          `${event.entityType} ${event.eventType} event.`,

        fromStatus:
          event.fromStatus,

        toStatus:
          event.toStatus,

        reason:
          event.reason,

        actor:
          event.actor,

        timestamp:
          event.timestamp,

        metadata:
          event.metadata,
      };
    },
  );
}
export function getResearchProvenanceTimelineByInvestigation(
  investigationId: string,
): ResearchProvenanceTimelineItem[] {
  return getResearchProvenanceEventsByInvestigationChronological(
    investigationId,
  ).map((event) => {
    const validation =
      event.entityType === "FindingValidation"
        ? getResearchFindingValidations().find(
          (item) => item.id === event.entityId,
        )
        : undefined;

    const finding = validation
      ? getResearchFindings().find(
        (item) => item.id === validation.findingId,
      )
      : undefined;

    const statusDescription =
      event.fromStatus && event.toStatus
        ? `${event.fromStatus} → ${event.toStatus}`
        : undefined;

    return {
      eventId: event.id,

      investigationId: event.investigationId,

      entityType: event.entityType,

      entityId: event.entityId,

      eventType: event.eventType,

      findingId: finding?.id,

      findingStatement: finding?.statement,

      validationId: validation?.id,

      validator: validation?.validator,

      decision: validation?.decision,

      title: `${event.entityType} ${event.eventType}`,

      description:
        statusDescription ??
        event.reason ??
        `${event.entityType} ${event.eventType} event.`,

      fromStatus: event.fromStatus,

      toStatus: event.toStatus,

      reason: event.reason,

      actor: event.actor,

      timestamp: event.timestamp,

      metadata:
        event.metadata,
    };
  });
}

export function getResearchProvenanceInvestigationSummary(
  investigationId: string,
): ResearchProvenanceInvestigationSummary {
  const events =
    getResearchProvenanceEventsByInvestigationChronological(
      investigationId,
    );

  const latest =
    events.length > 0
      ? events[events.length - 1]
      : undefined;

  const validationEventCount =
    events.filter(
      (event) =>
        event.entityType ===
        "FindingValidation" ||
        event.eventType ===
        "Validated" ||
        event.eventType ===
        "Rejected" ||
        event.eventType ===
        "RevisionRequested" ||
        event.eventType ===
        "Accepted",
    ).length;

  const statusChangeEventCount =
    events.filter(
      (event) =>
        event.eventType ===
        "StatusChanged",
    ).length;

  return {
    investigationId,

    eventCount:
      events.length,

    firstEventTimestamp:
      events[0]?.timestamp,

    latestEventTimestamp:
      latest?.timestamp,

    latestEventType:
      latest?.eventType,

    latestEntityType:
      latest?.entityType,

    latestEntityId:
      latest?.entityId,

    validationEventCount,

    statusChangeEventCount,

    valid:
      validateResearchProvenanceIntegrity()
        .issues
        .filter(
          (issue) =>
            issue.investigationId ===
            investigationId,
        ).length === 0,
  };
}

export function getResearchLineage(
  investigationId: string,
): ResearchLineage {
  const investigations =
    getResearchInvestigations();

  const experiments =
    getResearchExperiments();

  const evidence =
    getResearchEvidence();

  const findings =
    getResearchFindings();

  const validations =
    getResearchFindingValidations();

  const conclusions =
    getResearchInvestigationConclusions();

  const investigation =
    investigations.find(
      (item) =>
        item.id === investigationId,
    );

  if (!investigation) {
    return {
      investigationId,
      nodes: [],
      edges: [],
      valid: false,
      issueCount: 1,
    };
  }

  const nodes: ResearchLineageNode[] = [];
  const edges: ResearchLineageEdge[] = [];

  const investigationEvents =
    getResearchProvenanceEventsByInvestigation(
      investigationId,
    );

  const provenanceCount = (
    type: ResearchLineageNodeType,
    id: string,
  ) =>
    investigationEvents.filter(
      (event) =>
        event.entityType === type &&
        event.entityId === id,
    ).length;

  const addNode = (
    node: ResearchLineageNode,
  ) => {
    if (
      nodes.some(
        (item) =>
          item.id === node.id,
      )
    ) {
      return;
    }

    nodes.push(node);
  };

  const addEdge = (
    sourceId: string,
    targetId: string,
    type: ResearchLineageEdgeType,
    label: string,
  ) => {
    const id =
      `${sourceId}:${type}:${targetId}`;

    if (
      edges.some(
        (edge) =>
          edge.id === id,
      )
    ) {
      return;
    }

    edges.push({
      id,
      sourceId,
      targetId,
      type,
      label,
    });
  };

  const integrityIssues =
    validateResearchProvenanceIntegrity()
      .issues
      .filter(
        (issue) =>
          issue.investigationId ===
          investigationId,
      );

  addNode({
    id: investigation.id,
    type: "Investigation",
    title: investigation.title,
    description:
      investigation.question,
    status:
      investigation.status,
    investigationId,
    provenanceEventCount:
      provenanceCount(
        "Investigation",
        investigation.id,
      ),
    valid: true,
    issueCount: 0,
    missingLinks: [],
  });

  const experimentIds =
    investigation.experimentIds;

  for (const experimentId of experimentIds) {
    const experiment =
      experiments.find(
        (item) =>
          item.id === experimentId,
      );

    if (!experiment) {
      addNode({
        id: experimentId,
        type: "Experiment",
        title: "Missing experiment",
        investigationId,
        provenanceEventCount: 0,
        valid: false,
        issueCount: 1,
        missingLinks: [
          "Experiment record not found.",
        ],
      });

      addEdge(
        investigation.id,
        experimentId,
        "Contains",
        "Contains",
      );

      continue;
    }

    addNode({
      id: experiment.id,
      type: "Experiment",
      title: experiment.title,
      description:
        experiment.objective,
      status:
        experiment.status,
      investigationId,
      provenanceEventCount:
        provenanceCount(
          "Experiment",
          experiment.id,
        ),
      valid: true,
      issueCount: 0,
      missingLinks: [],
    });

    addEdge(
      investigation.id,
      experiment.id,
      "Contains",
      "Contains",
    );

    for (const evidenceId of experiment.evidenceIds) {
      addEdge(
        experiment.id,
        evidenceId,
        "Produces",
        "Evidence",
      );
    }

    for (const findingId of experiment.findingIds) {
      addEdge(
        experiment.id,
        findingId,
        "Produces",
        "Finding",
      );
    }
  }

  for (const evidenceId of investigation.evidenceIds) {
    const item =
      evidence.find(
        (candidate) =>
          candidate.id === evidenceId,
      );

    if (!item) {
      addNode({
        id: evidenceId,
        type: "Evidence",
        title: "Missing evidence",
        investigationId,
        provenanceEventCount: 0,
        valid: false,
        issueCount: 1,
        missingLinks: [
          "Evidence record not found.",
        ],
      });

      continue;
    }

    addNode({
      id: item.id,
      type: "Evidence",
      title: item.title,
      description:
        item.description,
      investigationId,
      provenanceEventCount:
        provenanceCount(
          "Evidence",
          item.id,
        ),
      valid: true,
      issueCount: 0,
      missingLinks: [],
    });
  }

  for (const findingId of investigation.findingIds) {
    const finding =
      findings.find(
        (item) =>
          item.id === findingId,
      );

    if (!finding) {
      addNode({
        id: findingId,
        type: "Finding",
        title: "Missing finding",
        investigationId,
        provenanceEventCount: 0,
        valid: false,
        issueCount: 1,
        missingLinks: [
          "Finding record not found.",
        ],
      });

      continue;
    }

    addNode({
      id: finding.id,
      type: "Finding",
      title: finding.statement,
      description:
        finding.confidence !== undefined
          ? `Confidence: ${Math.round(
              finding.confidence * 100,
            )}%`
          : undefined,
      investigationId,
      provenanceEventCount:
        provenanceCount(
          "Finding",
          finding.id,
        ),
      valid: true,
      issueCount: 0,
      missingLinks: [],
    });

    for (const assessment of
      finding.evidenceAssessments) {
      const evidenceItem =
        evidence.find(
          (item) =>
            item.id ===
            assessment.evidenceId,
        );

      if (!evidenceItem) {
        continue;
      }

      const edgeType: ResearchLineageEdgeType =
        assessment.type ===
        "Supporting"
          ? "Supports"
          : assessment.type ===
              "Contradicting"
            ? "Contradicts"
            : "Supports";

      addEdge(
        evidenceItem.id,
        finding.id,
        edgeType,
        assessment.type,
      );
    }

    for (const validationId of
      finding.validationIds) {
      const validation =
        validations.find(
          (item) =>
            item.id === validationId,
        );

      if (!validation) {
        addNode({
          id: validationId,
          type: "FindingValidation",
          title:
            "Missing validation",
          investigationId,
          provenanceEventCount: 0,
          valid: false,
          issueCount: 1,
          missingLinks: [
            "Finding validation record not found.",
          ],
        });

        addEdge(
          finding.id,
          validationId,
          "Validates",
          "Validation",
        );

        continue;
      }

      addNode({
        id: validation.id,
        type: "FindingValidation",
        title:
          "Finding validation",
        description:
          validation.rationale,
        status:
          validation.status,
        investigationId,
        provenanceEventCount:
          provenanceCount(
            "FindingValidation",
            validation.id,
          ),
        valid: true,
        issueCount: 0,
        missingLinks: [],
      });

      addEdge(
        finding.id,
        validation.id,
        "Validates",
        "Validation",
      );
    }
  }

  for (const conclusionId of
    investigation.conclusionIds) {
    const conclusion =
      conclusions.find(
        (item) =>
          item.id === conclusionId,
      );

    if (!conclusion) {
      addNode({
        id: conclusionId,
        type: "Conclusion",
        title: "Missing conclusion",
        investigationId,
        provenanceEventCount: 0,
        valid: false,
        issueCount: 1,
        missingLinks: [
          "Conclusion record not found.",
        ],
      });

      continue;
    }

    addNode({
      id: conclusion.id,
      type: "Conclusion",
      title:
        conclusion.statement,
      description:
        conclusion.uncertainty,
      status:
        conclusion.status,
      investigationId,
      provenanceEventCount:
        provenanceCount(
          "Conclusion",
          conclusion.id,
        ),
      valid: true,
      issueCount: 0,
      missingLinks: [],
    });

    for (const findingId of
      conclusion.supportingFindingIds) {
      addEdge(
        findingId,
        conclusion.id,
        "Supports",
        "Supports conclusion",
      );
    }

    for (const findingId of
      conclusion.contradictingFindingIds) {
      addEdge(
        findingId,
        conclusion.id,
        "Contradicts",
        "Contradicts conclusion",
      );
    }
  }

  const issueCount =
    integrityIssues.length +
    nodes.reduce(
      (total, node) =>
        total + node.issueCount,
      0,
    );

  return {
    investigationId,
    nodes,
    edges,
    valid:
      issueCount === 0,
    issueCount,
  };
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

export function getResearchLineageIntegrityCategory(
  code: string,
): ResearchLineageIntegrityCategory {
  if (
    code === "INVESTIGATION_NOT_FOUND"
  ) {
    return "Investigation";
  }

  if (
    code === "NODE_INVESTIGATION_MISMATCH" ||
    code === "INVALID_NODE" ||
    code === "NODE_ISSUES_PRESENT"
  ) {
    return "Node";
  }

  if (
    code === "DUPLICATE_EDGE" ||
    code === "SOURCE_NODE_NOT_FOUND" ||
    code === "TARGET_NODE_NOT_FOUND" ||
    code === "INVALID_EDGE_DIRECTION" ||
    code === "SELF_REFERENTIAL_EDGE"
  ) {
    return "Edge";
  }

  if (
    code === "CROSS_INVESTIGATION_EDGE"
  ) {
    return "Scope";
  }

  if (
    code ===
    "CONCLUSION_FINDING_REFERENCE_INVALID"
  ) {
    return "Reference";
  }

  if (
    code.startsWith("PROVENANCE_")
  ) {
    return "Provenance";
  }

  return "Reference";
}

export function getResearchLineageIntegrityPriority(
  code: string,
): ResearchLineageIntegrityPriority {
  if (
    code === "INVESTIGATION_NOT_FOUND" ||
    code === "CROSS_INVESTIGATION_EDGE"
  ) {
    return "Critical";
  }

  if (
    code === "SOURCE_NODE_NOT_FOUND" ||
    code === "TARGET_NODE_NOT_FOUND" ||
    code === "INVALID_EDGE_DIRECTION" ||
    code === "SELF_REFERENTIAL_EDGE" ||
    code ===
      "CONCLUSION_FINDING_REFERENCE_INVALID"
  ) {
    return "High";
  }

  if (
    code === "NODE_INVESTIGATION_MISMATCH" ||
    code === "INVALID_NODE" ||
    code === "NODE_ISSUES_PRESENT" ||
    code === "DUPLICATE_EDGE"
  ) {
    return "Medium";
  }

  if (
    code.startsWith("PROVENANCE_")
  ) {
    return "Low";
  }

  return "Medium";
}

export function getResearchLineageIntegrityPrioritySummary(
  issues: ResearchLineageIntegrityIssue[],
): ResearchLineageIntegrityPrioritySummary {
  const summary: ResearchLineageIntegrityPrioritySummary = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    highestPriority: null,
  };

  for (const issue of issues) {
    const priority =
      getResearchLineageIntegrityPriority(
        issue.code,
      );

    switch (priority) {
      case "Critical":
        summary.critical += 1;
        break;

      case "High":
        summary.high += 1;
        break;

      case "Medium":
        summary.medium += 1;
        break;

      case "Low":
        summary.low += 1;
        break;
    }
  }

  if (summary.critical > 0) {
    summary.highestPriority = "Critical";
  } else if (summary.high > 0) {
    summary.highestPriority = "High";
  } else if (summary.medium > 0) {
    summary.highestPriority = "Medium";
  } else if (summary.low > 0) {
    summary.highestPriority = "Low";
  }

  return summary;
}

export function validateResearchLineage(
  investigationId: string,
): ResearchLineageIntegrityResult {
  const lineage =
    getResearchLineage(
      investigationId,
    );

  const issues:
    ResearchLineageIntegrityIssue[] = [];

  const addIssue = (
    issue: ResearchLineageIntegrityIssue,
  ): void => {
    issues.push(issue);
  };

  if (
    lineage.nodes.length === 0
  ) {
    addIssue({
      investigationId,
      code: "INVESTIGATION_NOT_FOUND",
      message:
        `Investigation ${investigationId} has no lineage graph.`,
    });

    return {
      investigationId,
      valid: false,
      checkedNodeCount: 0,
      checkedEdgeCount: 0,
      issueCount: issues.length,
      issues,
    };
  }

  const nodeById =
    new Map(
      lineage.nodes.map(
        (node) => [
          node.id,
          node,
        ],
      ),
    );

  const edgeIds = new Set<string>();

  const validEdgeTypes: Record<
    ResearchLineageEdgeType,
    Array<
      [
        ResearchLineageNodeType,
        ResearchLineageNodeType,
      ]
    >
  > = {
    Contains: [
      ["Investigation", "Experiment"],
    ],

    Produces: [
      ["Experiment", "Evidence"],
      ["Experiment", "Finding"],
    ],

    Supports: [
      ["Evidence", "Finding"],
      ["Finding", "Conclusion"],
    ],

    Contradicts: [
      ["Evidence", "Finding"],
      ["Finding", "Conclusion"],
    ],

    Validates: [
      ["Finding", "FindingValidation"],
    ],
  };

  for (const node of lineage.nodes) {
    if (
      node.investigationId !==
      investigationId
    ) {
      addIssue({
        investigationId,
        code: "NODE_INVESTIGATION_MISMATCH",
        message:
          `Node ${node.id} belongs to investigation ${node.investigationId}, not ${investigationId}.`,
        nodeId: node.id,
      });
    }

    if (!node.valid) {
      addIssue({
        investigationId,
        code: "INVALID_NODE",
        message:
          `Lineage node ${node.id} is marked invalid: ${
            node.missingLinks.length > 0
              ? node.missingLinks.join(" ")
              : "the underlying research record is invalid."
          }`,
        nodeId: node.id,
      });
    }

    if (
      node.issueCount !==
      0
    ) {
      addIssue({
        investigationId,
        code: "NODE_ISSUES_PRESENT",
        message:
          `Lineage node ${node.id} reports ${node.issueCount} issue(s).`,
        nodeId: node.id,
      });
    }
  }

  for (const edge of lineage.edges) {
    if (
      edgeIds.has(edge.id)
    ) {
      addIssue({
        investigationId,
        code: "DUPLICATE_EDGE",
        message:
          `Lineage edge ${edge.id} appears more than once.`,
        edgeId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      });

      continue;
    }

    edgeIds.add(edge.id);

    const source =
      nodeById.get(
        edge.sourceId,
      );

    const target =
      nodeById.get(
        edge.targetId,
      );

    if (!source) {
      addIssue({
        investigationId,
        code: "SOURCE_NODE_NOT_FOUND",
        message:
          `Lineage edge ${edge.id} references missing source node ${edge.sourceId}.`,
        edgeId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      });
    }

    if (!target) {
      addIssue({
        investigationId,
        code: "TARGET_NODE_NOT_FOUND",
        message:
          `Lineage edge ${edge.id} references missing target node ${edge.targetId}.`,
        edgeId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      });
    }

    if (
      !source ||
      !target
    ) {
      continue;
    }

    if (
      source.investigationId !==
        investigationId ||
      target.investigationId !==
        investigationId
    ) {
      addIssue({
        investigationId,
        code: "CROSS_INVESTIGATION_EDGE",
        message:
          `Lineage edge ${edge.id} crosses investigation boundaries.`,
        edgeId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      });
    }

    const allowedPairs =
      validEdgeTypes[
        edge.type
      ];

    const validPair =
      allowedPairs?.some(
        ([sourceType, targetType]) =>
          source.type ===
            sourceType &&
          target.type ===
            targetType,
      ) ?? false;

    if (!validPair) {
      addIssue({
        investigationId,
        code: "INVALID_EDGE_DIRECTION",
        message:
          `Edge ${edge.id} has invalid relationship ${edge.type}: ${source.type} → ${target.type}.`,
        edgeId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      });
    }

    if (
      edge.sourceId ===
      edge.targetId
    ) {
      addIssue({
        investigationId,
        code: "SELF_REFERENTIAL_EDGE",
        message:
          `Lineage edge ${edge.id} connects node ${edge.sourceId} to itself.`,
        edgeId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      });
    }
  }

    for (const edge of lineage.edges) {
    if (
      edge.type !== "Supports" &&
      edge.type !== "Contradicts"
    ) {
      continue;
    }

    const target =
      nodeById.get(
        edge.targetId,
      );

    if (
      target?.type !==
      "Conclusion"
    ) {
      continue;
    }

    const source =
      nodeById.get(
        edge.sourceId,
      );

    if (
      source?.type !==
      "Finding"
    ) {
      addIssue({
        investigationId,
        code:
          "CONCLUSION_FINDING_REFERENCE_INVALID",
        message:
          `Conclusion ${edge.targetId} references ${edge.sourceId}, which is not a Finding node.`,
        edgeId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      });
    }
  }

  const provenanceResult =
    validateResearchProvenanceIntegrity();

  const provenanceIssues =
    provenanceResult.issues.filter(
      (issue) =>
        issue.investigationId ===
        investigationId,
    );

  for (
    const issue of provenanceIssues
  ) {
    addIssue({
      investigationId,
      code:
        `PROVENANCE_${issue.code}`,
      message:
        `Underlying provenance issue ${issue.code}: ${issue.message}`,
    });
  }

  const nodeIssueCounts =
    new Map<
      string,
      number
    >();

  for (
    const issue of issues
  ) {
    if (!issue.nodeId) {
      continue;
    }

    nodeIssueCounts.set(
      issue.nodeId,
      (nodeIssueCounts.get(
        issue.nodeId,
      ) ?? 0) + 1,
    );
  }

  for (
    const node of lineage.nodes
  ) {
    const derivedIssueCount =
      nodeIssueCounts.get(
        node.id,
      ) ?? 0;

    if (
      derivedIssueCount >
      0
    ) {
      continue;
    }
  }

  return {
    investigationId,

    valid:
      issues.length === 0,

    checkedNodeCount:
      lineage.nodes.length,

    checkedEdgeCount:
      lineage.edges.length,

    issueCount:
      issues.length,

    issues,
  };
}

export function validateResearchLineageForInvestigation(
  investigationId: string,
): ResearchLineageIntegrityResult {
  return validateResearchLineage(
    investigationId,
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

export function getResearchProvenanceIntegritySummary():
  ResearchProvenanceIntegritySummary {
  const result =
    validateResearchProvenanceIntegrity();

  const issueCodes =
    Array.from(
      new Set(
        result.issues.map(
          (issue) =>
            issue.code,
        ),
      ),
    );

  return {
    valid:
      result.valid,

    checkedEventCount:
      result.checkedEventCount,

    issueCount:
      result.issues.length,

    issueCodes,
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
