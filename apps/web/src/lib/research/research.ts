import type {
  ResearchEvidence,
  ResearchEvidenceAssessment,
  ResearchExperiment,
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
  ResearchProvenanceIntegrityResult,
  ResearchProvenanceIntegritySummary,
  ResearchProvenanceInvestigationSummary,
  ResearchLineage,
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityResult,
  ResearchLineageIntegrityIssueAction,
  ResearchLineageIntegrityActionTarget,
  ResearchLineageIntegrityRemediationRequest,
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationResult,
  ResearchLineageIntegrityRemediationPreview,
  ResearchLineageIntegrityRemediationExecutionPolicy,
  ResearchLineageIntegrityRemediationTargetValidation,
  ResearchLineageIntegrityRemediationExecutionPreflight,
  ResearchLineageIntegrityRemediationRepairDecisionResult,
  ResearchLineageIntegrityRemediationReplacementDiscoveryResult,
  ResearchLineageIntegrityRemediationRepairExecutionResult,
  ResearchLineageIntegrityResolvedRemediationTarget,
  ResearchLineageIntegrityRemediationMutationContract,
} from "@/types/research";

import { evaluateFindingValidationEligibility } from "./evidenceAssessment";

import { localResearchPersistence } from "./persistence";

import {
  getResearchLineage as buildResearchLineage,
} from "./lineage/graph";

import {
  validateResearchLineage as analyzeResearchLineage,
} from "./lineage/integrity";

import {
  getResearchProvenanceEventsByInvestigation as queryResearchProvenanceEventsByInvestigation,
  getResearchProvenanceEventsByEntity as queryResearchProvenanceEventsByEntity,
  getResearchProvenanceEventsByInvestigationAndEntity as queryResearchProvenanceEventsByInvestigationAndEntity,
  getResearchProvenanceEventsChronological as sortResearchProvenanceEventsChronological,
  getResearchProvenanceTimeline as buildResearchProvenanceTimeline,
  getResearchProvenanceTimelineByInvestigation as buildResearchProvenanceTimelineByInvestigation,
  getResearchProvenanceInvestigationSummary as buildResearchProvenanceInvestigationSummary,
  getResearchProvenanceEventsByEventType as filterResearchProvenanceEventsByEventType,
  getResearchProvenanceEventsByInvestigationChronological as queryResearchProvenanceEventsByInvestigationChronological,
  getLatestResearchProvenanceEvent as queryLatestResearchProvenanceEvent,
} from "./provenance/events";

import {
  validateResearchProvenanceIntegrity as analyzeResearchProvenanceIntegrity,
} from "./provenance/integrity";

import {
  createResearchProvenanceRepository,
} from "./provenance/repository";

import {
  canTransitionResearchFindingValidation as analyzeCanTransitionResearchFindingValidation,
  transitionResearchFindingValidation as analyzeTransitionResearchFindingValidation,
  createResearchFindingValidation as analyzeCreateResearchFindingValidation,
} from "./validation/lifecycle";

import {
  getResearchFindingValidations as analyzeGetResearchFindingValidations,
  saveResearchFindingValidation as analyzeSaveResearchFindingValidation,
  getResearchFindingValidationHistory as analyzeGetResearchFindingValidationHistory,
  saveResearchFindingValidationHistoryEvent as analyzeSaveResearchFindingValidationHistoryEvent,
} from "./validation/repository";

import {
  executeResearchLineageIntegrityRemediation as analyzeExecuteResearchLineageIntegrityRemediation,
} from "./lineage/remediation/execution";

import {
  discoverResearchLineageIntegrityRemediationReplacement as analyzeDiscoverResearchLineageIntegrityRemediationReplacement,
  decideResearchLineageIntegrityRemediationRepair as analyzeDecideResearchLineageIntegrityRemediationRepair,
  createResearchLineageIntegrityRemediationMutationContract as analyzeCreateResearchLineageIntegrityRemediationMutationContract,
  executeResearchLineageIntegrityRemediationRepair as analyzeExecuteResearchLineageIntegrityRemediationRepair,
} from "./lineage/remediation/repair";

export {
  getResearchLineageIntegrityCategory,
  getResearchLineageIntegrityPriority,
  getResearchLineageIntegrityPrioritySummary,
  getResearchLineageIntegrityAssessment,
  getResearchLineageIntegrityAssessmentExplanation,
  getResearchLineageIntegrityIssueExplanation,
} from "./lineage/assessment";

import {
  canTransitionResearchExperiment as analyzeCanTransitionResearchExperiment,
  transitionResearchExperiment as analyzeTransitionResearchExperiment,
} from "./experiment/lifecycle";

import {
  createResearchEvidenceAssessment as analyzeCreateResearchEvidenceAssessment,
  updateResearchFindingEvidenceAssessment as analyzeUpdateResearchFindingEvidenceAssessment,
  removeResearchFindingEvidenceAssessment as analyzeRemoveResearchFindingEvidenceAssessment,
} from "./evidence/assessment";

import {
  getResearchFindings as analyzeGetResearchFindings,
  saveResearchFinding as analyzeSaveResearchFinding,
} from "./finding/repository";

import {
  createResearchInvestigationRepository,
} from "./investigation/repository";

const researchPersistence = localResearchPersistence;

const researchProvenanceRepository =
  createResearchProvenanceRepository({
    loadResearchProvenanceEvents: () =>
      researchPersistence.load().provenanceEvents,

    saveResearchProvenanceEvents: (events) =>
      researchPersistence.saveProvenanceEvents(events),

    createId,

    now: () => new Date().toISOString(),
  });

const researchInvestigationRepository =
  createResearchInvestigationRepository({
    loadResearchInvestigations: () =>
      researchPersistence.load().investigations,

    saveResearchInvestigations: (investigations) =>
      researchPersistence.saveInvestigations(investigations),

    getCollectionSnapshotKey: () =>
      researchPersistence.getCollectionSnapshotKey("investigations"),

    isServer: () => typeof window === "undefined",

    createId,

    now: () => new Date().toISOString(),
  });
/* -------------------------------------------------------------------------- */
/*                              Utilities                                     */
/* -------------------------------------------------------------------------- */

export function getResearchPersistenceSnapshot(): string | null {
  return researchPersistence.getSnapshotKey();
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* -------------------------------------------------------------------------- */
/*                         Investigations                                     */
/* -------------------------------------------------------------------------- */

export function getResearchInvestigations(): ResearchInvestigation[] {
  return researchInvestigationRepository.getResearchInvestigations();
}

export function saveResearchInvestigation(
  investigation: ResearchInvestigation,
): void {
  researchInvestigationRepository.saveResearchInvestigation(investigation);
}

export function createResearchInvestigation(
  input: Pick<
    ResearchInvestigation,
    "title" | "objective" | "question"
  > &
    Partial<Pick<ResearchInvestigation, "description" | "repository">>,
): ResearchInvestigation {
  return researchInvestigationRepository.createResearchInvestigation(input);
}

/* -------------------------------------------------------------------------- */
/*                    Experiment Lifecycle                                    */
/* -------------------------------------------------------------------------- */

export function canTransitionResearchExperiment(
  from: ResearchStatus,
  to: ResearchStatus,
): boolean {
  return analyzeCanTransitionResearchExperiment(from, to);
}

export function transitionResearchExperiment(
  experiment: ResearchExperiment,
  to: ResearchStatus,
  reason?: string,
): ResearchExperiment | null {
  return analyzeTransitionResearchExperiment(
    experiment,
    to,
    reason,
    {
      saveResearchExperiment,
      createResearchProvenanceEvent,
      createId,
      now: () => new Date().toISOString(),
    },
  );
}

const RESEARCH_CONCLUSION_TRANSITIONS: Record<
  ResearchConclusionStatus,
  ResearchConclusionStatus[]
> = {
  Draft: ["Proposed"],

  Proposed: ["Accepted", "Draft"],

  Accepted: ["Superseded"],

  Superseded: [],
};

export function canTransitionResearchInvestigationConclusion(
  from: ResearchConclusionStatus,
  to: ResearchConclusionStatus,
): boolean {
  return RESEARCH_CONCLUSION_TRANSITIONS[from]?.includes(to) ?? false;
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

  const findings = getResearchFindings();

  const validations = getResearchFindingValidations();

  const supportingFindingCount = conclusion.supportingFindingIds.length;

  if (supportingFindingCount === 0) {
    reasons.push("At least one supporting finding is required.");

    return {
      eligible: false,
      reasons,
      supportingFindingCount: 0,
      validatedFindingCount: 0,
    };
  }

  let validatedFindingCount = 0;

  for (const findingId of conclusion.supportingFindingIds) {
    const finding = findings.find((item) => item.id === findingId);

    if (!finding) {
      reasons.push(`Supporting finding ${findingId} was not found.`);

      continue;
    }

    const validated = finding.validationIds.some((validationId) => {
      const validation = validations.find((item) => item.id === validationId);

      return validation?.status === "Validated";
    });

    if (validated) {
      validatedFindingCount += 1;
    } else {
      reasons.push(`Supporting finding "${finding.statement}" has not been validated.`);
    }
  }

  return {
    eligible: reasons.length === 0,

    reasons,

    supportingFindingCount,

    validatedFindingCount,
  };
}

export function transitionResearchInvestigationConclusion(
  conclusion: ResearchInvestigationConclusion,
  to: ResearchConclusionStatus,
): ResearchInvestigationConclusion | null {
  if (conclusion.status === to) {
    return conclusion;
  }

  if (!canTransitionResearchInvestigationConclusion(conclusion.status, to)) {
    return null;
  }

  if (to === "Accepted") {
    const acceptance = evaluateResearchInvestigationConclusionAcceptance(conclusion);

    if (!acceptance.eligible) {
      return null;
    }
  }

  const updatedConclusion: ResearchInvestigationConclusion = {
    ...conclusion,

    status: to,

    updatedAt: new Date().toISOString(),
  };

  saveResearchInvestigationConclusion(updatedConclusion);

  createResearchProvenanceEvent({
    investigationId: conclusion.investigationId,

    entityType: "Conclusion",

    entityId: conclusion.id,

    eventType:
      to === "Accepted" ? "Accepted" : to === "Superseded" ? "Superseded" : "StatusChanged",

    fromStatus: conclusion.status,

    toStatus: to,
  });

  return updatedConclusion;
}
/* -------------------------------------------------------------------------- */
/*                              Experiments                                   */
/* -------------------------------------------------------------------------- */

export function getResearchExperiments(): ResearchExperiment[] {
  const stored =
    researchPersistence.load().experiments;

  return stored.map((experiment) => ({
    ...experiment,

    lifecycle: experiment.lifecycle ?? [],
  }));
}

export function saveResearchExperiment(experiment: ResearchExperiment): void {
  const experiments = getResearchExperiments();

  const existingIndex = experiments.findIndex((item) => item.id === experiment.id);

  if (existingIndex >= 0) {
    experiments[existingIndex] = experiment;
  } else {
    experiments.unshift(experiment);
  }

  researchPersistence.saveExperiments(
    experiments,
  );
}

/* -------------------------------------------------------------------------- */
/*                               Evidence                                     */
/* -------------------------------------------------------------------------- */

export function getResearchEvidence(): ResearchEvidence[] {
  return researchPersistence.load().evidence;
}

export function saveResearchEvidence(evidence: ResearchEvidence): void {
  const collection = getResearchEvidence();

  const existingIndex = collection.findIndex((item) => item.id === evidence.id);

  if (existingIndex >= 0) {
    collection[existingIndex] = evidence;
  } else {
    collection.unshift(evidence);
  }

 researchPersistence.saveEvidence(collection);
}
/* -------------------------------------------------------------------------- */
/*                               Findings                                     */
/* -------------------------------------------------------------------------- */

export function getResearchFindings(): ResearchFinding[] {
  return analyzeGetResearchFindings({
    loadResearchFindings: () => researchPersistence.load().findings,
    saveResearchFindings: (findings) =>
      researchPersistence.saveFindings(findings),
    createId,
    now: () => new Date().toISOString(),
  });
}

export function saveResearchFinding(
  finding: ResearchFinding,
): void {
  analyzeSaveResearchFinding(finding, {
    loadResearchFindings: () => researchPersistence.load().findings,
    saveResearchFindings: (findings) =>
      researchPersistence.saveFindings(findings),
    createId,
    now: () => new Date().toISOString(),
  });
}

/* -------------------------------------------------------------------------- */
/*                         Finding Validation                                 */
/* -------------------------------------------------------------------------- */

export function getResearchFindingValidations(): ResearchFindingValidation[] {
  return analyzeGetResearchFindingValidations({
    loadResearchFindingValidations: () =>
      researchPersistence.load().findingValidations,
    saveResearchFindingValidations: (validations) =>
      researchPersistence.saveFindingValidations(validations),
    loadResearchFindingValidationHistory: () =>
      researchPersistence.load().findingValidationHistory,
    saveResearchFindingValidationHistory: (history) =>
      researchPersistence.saveFindingValidationHistory(history),
  });
}

export function saveResearchFindingValidation(
  validation: ResearchFindingValidation,
): void {
  analyzeSaveResearchFindingValidation(validation, {
    loadResearchFindingValidations: () =>
      researchPersistence.load().findingValidations,
    saveResearchFindingValidations: (validations) =>
      researchPersistence.saveFindingValidations(validations),
    loadResearchFindingValidationHistory: () =>
      researchPersistence.load().findingValidationHistory,
    saveResearchFindingValidationHistory: (history) =>
      researchPersistence.saveFindingValidationHistory(history),
  });
}

export function getResearchFindingValidationHistory(): ResearchFindingValidationHistoryEvent[] {
  return analyzeGetResearchFindingValidationHistory({
    loadResearchFindingValidations: () =>
      researchPersistence.load().findingValidations,
    saveResearchFindingValidations: (validations) =>
      researchPersistence.saveFindingValidations(validations),
    loadResearchFindingValidationHistory: () =>
      researchPersistence.load().findingValidationHistory,
    saveResearchFindingValidationHistory: (history) =>
      researchPersistence.saveFindingValidationHistory(history),
  });
}

export function saveResearchFindingValidationHistoryEvent(
  event: ResearchFindingValidationHistoryEvent,
): void {
  analyzeSaveResearchFindingValidationHistoryEvent(event, {
    loadResearchFindingValidations: () =>
      researchPersistence.load().findingValidations,
    saveResearchFindingValidations: (validations) =>
      researchPersistence.saveFindingValidations(validations),
    loadResearchFindingValidationHistory: () =>
      researchPersistence.load().findingValidationHistory,
    saveResearchFindingValidationHistory: (history) =>
      researchPersistence.saveFindingValidationHistory(history),
  });
}

export function canTransitionResearchFindingValidation(
  from: ResearchValidationStatus,
  to: ResearchValidationStatus,
): boolean {
  return analyzeCanTransitionResearchFindingValidation(from, to);
}

export function transitionResearchFindingValidation(
  validationId: string,
  to: ResearchValidationStatus,
  reason?: string,
): ResearchFindingValidation | null {
  return analyzeTransitionResearchFindingValidation(
    validationId,
    to,
    reason,
    {
      getResearchFindingValidations,
      saveResearchFindingValidation,
      getResearchFindingValidationHistory,
      saveResearchFindingValidationHistoryEvent,
      getResearchFindings,
      saveResearchFinding,
      getResearchInvestigations,
      createResearchProvenanceEvent,
      evaluateFindingValidationEligibility,
      createId,
      now: () => new Date().toISOString(),
    },
  );
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
  return analyzeCreateResearchFindingValidation(
    findingId,
    input,
    {
      getResearchFindingValidations,
      saveResearchFindingValidation,
      getResearchFindingValidationHistory,
      saveResearchFindingValidationHistoryEvent,
      getResearchFindings,
      saveResearchFinding,
      getResearchInvestigations,
      createResearchProvenanceEvent,
      evaluateFindingValidationEligibility,
      createId,
      now: () => new Date().toISOString(),
    },
  );
}

/* -------------------------------------------------------------------------- */
/*                    Investigation Conclusions                              */
/* -------------------------------------------------------------------------- */

export function getResearchInvestigationConclusions(): ResearchInvestigationConclusion[] {
  const stored = researchPersistence.load().investigationConclusions;

  return stored.map((conclusion) => ({
    ...conclusion,

    supportingFindingIds: Array.isArray(conclusion.supportingFindingIds)
      ? conclusion.supportingFindingIds
      : [],

    contradictingFindingIds: Array.isArray(conclusion.contradictingFindingIds)
      ? conclusion.contradictingFindingIds
      : [],
  }));
}

export function saveResearchInvestigationConclusion(
  conclusion: ResearchInvestigationConclusion,
): void {
  const conclusions = getResearchInvestigationConclusions();

  const existingIndex = conclusions.findIndex((item) => item.id === conclusion.id);

  if (existingIndex >= 0) {
    conclusions[existingIndex] = conclusion;
  } else {
    conclusions.unshift(conclusion);
  }

  researchPersistence.saveInvestigationConclusions(conclusions);
}

export function createResearchInvestigationConclusion(
  input: Omit<ResearchInvestigationConclusion, "id" | "createdAt" | "updatedAt">,
): ResearchInvestigationConclusion {
  const now = new Date().toISOString();

  const conclusion: ResearchInvestigationConclusion = {
    ...input,

    id: createId("investigation-conclusion"),

    createdAt: now,

    updatedAt: now,
  };

  saveResearchInvestigationConclusion(conclusion);

  return conclusion;
}

export function attachResearchInvestigationConclusion(
  investigationId: string,
  conclusionId: string,
): ResearchInvestigation | null {
  const investigations = getResearchInvestigations();

  const investigationIndex = investigations.findIndex((item) => item.id === investigationId);

  if (investigationIndex < 0) {
    return null;
  }

  const conclusion = getResearchInvestigationConclusions().find((item) => item.id === conclusionId);

  if (!conclusion) {
    return null;
  }

  if (conclusion.investigationId !== investigationId) {
    return null;
  }

  const investigation = investigations[investigationIndex];

  if (investigation.conclusionIds.includes(conclusionId)) {
    return investigation;
  }

  const updatedInvestigation: ResearchInvestigation = {
    ...investigation,

    conclusionIds: [...investigation.conclusionIds, conclusionId],

    updatedAt: new Date().toISOString(),
  };

  investigations[investigationIndex] = updatedInvestigation;

  saveResearchInvestigation(updatedInvestigation);

  return updatedInvestigation;
}

export function detachResearchInvestigationConclusion(
  investigationId: string,
  conclusionId: string,
): ResearchInvestigation | null {
  const investigations = getResearchInvestigations();

  const investigationIndex = investigations.findIndex((item) => item.id === investigationId);

  if (investigationIndex < 0) {
    return null;
  }

  const investigation = investigations[investigationIndex];

  if (!investigation.conclusionIds.includes(conclusionId)) {
    return investigation;
  }

  const updatedInvestigation: ResearchInvestigation = {
    ...investigation,

    conclusionIds: investigation.conclusionIds.filter((id) => id !== conclusionId),

    updatedAt: new Date().toISOString(),
  };

  investigations[investigationIndex] = updatedInvestigation;

  saveResearchInvestigation(updatedInvestigation);

  return updatedInvestigation;
}
export function createResearchEvidenceAssessment(
  input: Omit<ResearchEvidenceAssessment, "id" | "assessedAt" | "updatedAt">,
): ResearchEvidenceAssessment {
  return analyzeCreateResearchEvidenceAssessment(
    input,
    {
      createId,
      getResearchFindings,
      saveResearchFinding,
      now: () => new Date().toISOString(),
    },
  );
}

export function updateResearchFindingEvidenceAssessment(
  findingId: string,
  assessment: ResearchEvidenceAssessment,
): ResearchFinding | null {
  return analyzeUpdateResearchFindingEvidenceAssessment(
    findingId,
    assessment,
    {
      createId,
      getResearchFindings,
      saveResearchFinding,
      now: () => new Date().toISOString(),
    },
  );
}

export function removeResearchFindingEvidenceAssessment(
  findingId: string,
  assessmentId: string,
): ResearchFinding | null {
  return analyzeRemoveResearchFindingEvidenceAssessment(
    findingId,
    assessmentId,
    {
      createId,
      getResearchFindings,
      saveResearchFinding,
      now: () => new Date().toISOString(),
    },
  );
}

/* -------------------------------------------------------------------------- */
/*                         Research Provenance                                */
/* -------------------------------------------------------------------------- */

export function getResearchProvenanceEvents(): ResearchProvenanceEvent[] {
  return researchProvenanceRepository.getResearchProvenanceEvents();
}

export function getResearchProvenanceEventsByInvestigation(
  investigationId: string,
): ResearchProvenanceEvent[] {
  return queryResearchProvenanceEventsByInvestigation(
    getResearchProvenanceEvents(),
    investigationId,
  );
}

export function getResearchProvenanceEventsByEntity(
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent[] {
  return queryResearchProvenanceEventsByEntity(
    getResearchProvenanceEvents(),
    entityType,
    entityId,
  );
}

export function getResearchProvenanceEventsByInvestigationAndEntity(
  investigationId: string,
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent[] {
  return queryResearchProvenanceEventsByInvestigationAndEntity(
    getResearchProvenanceEvents(),
    investigationId,
    entityType,
    entityId,
  );
}

export function getResearchProvenanceEventsChronological(): ResearchProvenanceEvent[] {
  return sortResearchProvenanceEventsChronological(
    getResearchProvenanceEvents(),
  );
}

export function getResearchProvenanceTimeline(): ResearchProvenanceTimelineItem[] {
  return buildResearchProvenanceTimeline({
    getResearchProvenanceEvents,
    getResearchFindingValidations,
    getResearchFindings,
    validateResearchProvenanceIntegrity,
  });
}

export function getResearchProvenanceTimelineByInvestigation(
  investigationId: string,
): ResearchProvenanceTimelineItem[] {
  return buildResearchProvenanceTimelineByInvestigation(
    investigationId,
    {
      getResearchProvenanceEvents,
      getResearchFindingValidations,
      getResearchFindings,
      validateResearchProvenanceIntegrity,
    },
  );
}

export function getResearchProvenanceInvestigationSummary(
  investigationId: string,
): ResearchProvenanceInvestigationSummary {
  return buildResearchProvenanceInvestigationSummary(
    investigationId,
    {
      getResearchProvenanceEvents,
      getResearchFindingValidations,
      getResearchFindings,
      validateResearchProvenanceIntegrity,
    },
  );
}

export function getResearchLineage(
  investigationId: string,
): ResearchLineage {
  return buildResearchLineage(
    investigationId,
    {
      getResearchInvestigations,
      getResearchExperiments,
      getResearchEvidence,
      getResearchFindings,
      getResearchFindingValidations,
      getResearchInvestigationConclusions,
      getResearchProvenanceEventsByInvestigation,
      validateResearchProvenanceIntegrity,
    },
  );
}

export function getResearchProvenanceEventsByInvestigationChronological(
  investigationId: string,
): ResearchProvenanceEvent[] {
  return queryResearchProvenanceEventsByInvestigationChronological(
    getResearchProvenanceEvents(),
    investigationId,
  );
}

export function getLatestResearchProvenanceEvent(
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent | null {
  return queryLatestResearchProvenanceEvent(
    getResearchProvenanceEvents(),
    entityType,
    entityId,
  );
}

export function discoverResearchLineageIntegrityRemediationReplacement(
  plan: ResearchLineageIntegrityRemediationPlan,
): ResearchLineageIntegrityRemediationReplacementDiscoveryResult {
  return analyzeDiscoverResearchLineageIntegrityRemediationReplacement(
    plan,
    {
      getResearchInvestigations,
      getResearchFindings,
      getResearchInvestigationConclusions,
      resolveResearchLineageIntegrityRemediationTarget,
      saveResearchInvestigationConclusion,
      createResearchProvenanceEvent,
      validateResearchLineage,
    },
  );
}

export function decideResearchLineageIntegrityRemediationRepair(
  plan: ResearchLineageIntegrityRemediationPlan,
): ResearchLineageIntegrityRemediationRepairDecisionResult {
  return analyzeDecideResearchLineageIntegrityRemediationRepair(
    plan,
    {
      getResearchInvestigations,
      getResearchFindings,
      getResearchInvestigationConclusions,
      resolveResearchLineageIntegrityRemediationTarget,
      saveResearchInvestigationConclusion,
      createResearchProvenanceEvent,
      validateResearchLineage,
    },
  );
}

export function createResearchLineageIntegrityRemediationMutationContract(
  decision: ResearchLineageIntegrityRemediationRepairDecisionResult,
): ResearchLineageIntegrityRemediationMutationContract | null {
  return analyzeCreateResearchLineageIntegrityRemediationMutationContract(
    decision,
  );
}

export function executeResearchLineageIntegrityRemediationRepair(
  decision: ResearchLineageIntegrityRemediationRepairDecisionResult,
): ResearchLineageIntegrityRemediationRepairExecutionResult {
  return analyzeExecuteResearchLineageIntegrityRemediationRepair(
    decision,
    {
      getResearchInvestigations,
      getResearchFindings,
      getResearchInvestigationConclusions,
      resolveResearchLineageIntegrityRemediationTarget,
      saveResearchInvestigationConclusion,
      createResearchProvenanceEvent,
      validateResearchLineage,
    },
  );
}

/* -------------------------------------------------------------------------- */
/*                    Lineage Integrity Issue Actions                         */
/* -------------------------------------------------------------------------- */

export function getResearchLineageIntegrityIssueAction(
  issue: ResearchLineageIntegrityIssue,
): ResearchLineageIntegrityIssueAction {
  const code = issue.code;

  const target = {
    nodeId: issue.nodeId,
    edgeId: issue.edgeId,
    sourceId: issue.sourceId,
    targetId: issue.targetId,
  };
  switch (code) {
    case "INVESTIGATION_NOT_FOUND":
    case "SOURCE_NODE_NOT_FOUND":
    case "TARGET_NODE_NOT_FOUND":
    case "CONCLUSION_FINDING_REFERENCE_INVALID":
      return {
        action: "RepairReference",
        label: "Repair reference",
        description: "Inspect and repair the unresolved research reference.",
        requiresConfirmation: true,
        readiness: "Planned",
        target,
      };

    case "NODE_INVESTIGATION_MISMATCH":
    case "CROSS_INVESTIGATION_EDGE":
      return {
        action: "RepairScope",
        label: "Repair scope",
        description: "Inspect the investigation ownership and correct the lineage scope.",
        requiresConfirmation: true,
        readiness: "Planned",
        target,
      };

    case "DUPLICATE_EDGE":
    case "INVALID_EDGE_DIRECTION":
    case "SELF_REFERENTIAL_EDGE":
      return {
        action: "RepairRelationship",
        label: "Repair relationship",
        description: "Inspect the lineage relationship and correct the invalid edge.",
        requiresConfirmation: true,
        readiness: "Planned",
        target,
      };

    case "INVALID_NODE":
    case "NODE_ISSUES_PRESENT":
      return {
        action: "Inspect",
        label: "Inspect node",
        description: "Inspect the underlying research record before making a repair.",
        requiresConfirmation: false,
        readiness: "Ready",
        target,
      };

    default:
      if (code.startsWith("PROVENANCE_")) {
        return {
          action: "ReviewProvenance",
          label: "Review provenance",
          description: "Inspect the associated provenance record and its lineage history.",
          requiresConfirmation: false,
          readiness: "Ready",
          target,
        };
      }

      return {
        action: "Inspect",
        label: "Inspect finding",
        description: "Inspect the associated lineage records before taking corrective action.",
        requiresConfirmation: false,
        readiness: "Ready",
        target,
      };
  }
}

export function createResearchLineageIntegrityRemediationRequest(
  investigationId: string,
  issue: ResearchLineageIntegrityIssue,
  confirmed: boolean,
  replacementEntityId?: string,
): ResearchLineageIntegrityRemediationRequest | null {
  const action = getResearchLineageIntegrityIssueAction(issue);

  if (action.action === "Inspect" || action.action === "ReviewProvenance") {
    return null;
  }

  if (action.requiresConfirmation && !confirmed) {
    return null;
  }

  return {
    investigationId,
    action: action.action,
    issueCode: issue.code,
    target: action.target,
    replacementEntityId,
    confirmed,
  };
}

function getResearchLineageRemediationEntityUpdatedAt(
  target: ResearchLineageIntegrityResolvedRemediationTarget,
): string | undefined {
  if (!target.resolvable || !target.entityId) {
    return undefined;
  }

  switch (target.kind) {
    case "Investigation":
      return getResearchInvestigations().find(
        (item) => item.id === target.entityId,
      )?.updatedAt;

    case "Experiment":
      return getResearchExperiments().find(
        (item) => item.id === target.entityId,
      )?.updatedAt;

    case "Finding":
      return getResearchFindings().find(
        (item) => item.id === target.entityId,
      )?.updatedAt;

    case "FindingValidation":
      return getResearchFindingValidations().find(
        (item) => item.id === target.entityId,
      )?.updatedAt;

    case "Conclusion":
      return getResearchInvestigationConclusions().find(
        (item) => item.id === target.entityId,
      )?.updatedAt;

    case "Evidence":
      /*
       * ResearchEvidence currently has no updatedAt field.
       *
       * Until ResearchEvidence gains an updatedAt timestamp,
       * concurrency protection cannot be based on an entity
       * update timestamp for evidence targets.
       */
      return undefined;
  }
}

export function getResearchLineageRemediationReplacement(
  investigationId: string,
  replacementEntityId: string | undefined,
): ResearchFinding | undefined {
  if (!replacementEntityId) {
    return undefined;
  }

  const investigation = getResearchInvestigations().find(
    (item) => item.id === investigationId,
  );

  if (!investigation) {
    return undefined;
  }

  if (!investigation.findingIds.includes(replacementEntityId)) {
    return undefined;
  }

  return getResearchFindings().find(
    (finding) =>
      finding.id === replacementEntityId,
  );
}

export function createResearchLineageIntegrityRemediationPlan(
  request: ResearchLineageIntegrityRemediationRequest,
): ResearchLineageIntegrityRemediationPlan {
  const resolvedTarget =
    resolveResearchLineageIntegrityRemediationTarget(
      request.investigationId,
      request.target,
      request.action,
    );

  const targetUpdatedAt =
    getResearchLineageRemediationEntityUpdatedAt(resolvedTarget);

  let replacementUpdatedAt: string | undefined;

  if (request.replacementEntityId) {
    replacementUpdatedAt =
      getResearchLineageRemediationReplacement(
        request.investigationId,
        request.replacementEntityId,
      )?.updatedAt;
  }

  return {
    investigationId: request.investigationId,
    action: request.action,
    issueCode: request.issueCode,
    target: request.target,
    replacementEntityId:
      request.replacementEntityId,
    confirmed: request.confirmed,
    status: request.confirmed
      ? "Validated"
      : "Planned",
    description:
      `Proposed ${request.action} remediation for ${request.issueCode}.`,
    targetUpdatedAt,
    replacementUpdatedAt,
  };
}

export function getResearchLineageIntegrityRemediationExecutionPolicy(
  action: ResearchLineageIntegrityRemediationRequest["action"],
): ResearchLineageIntegrityRemediationExecutionPolicy {
  return {
    action,
    requiresConfirmation: true,
    mutatesResearchData: true,
    createsProvenanceEvent: true,
    requiresTargetValidation: true,
  };
}

export function validateResearchLineageIntegrityRemediationTarget(
  investigationId: string,
  target: ResearchLineageIntegrityActionTarget,
  action?: ResearchLineageIntegrityRemediationPlan["action"],
): ResearchLineageIntegrityRemediationTargetValidation {
  const lineage = getResearchLineage(investigationId);

  if (lineage.investigationId !== investigationId) {
    return {
      valid: false,
      reason: "The remediation target does not belong to the requested investigation.",
      investigationId,
      target,
    };
  }

  if (target.nodeId && !lineage.nodes.some((node) => node.id === target.nodeId)) {
    return {
      valid: false,
      reason: "The requested remediation node could not be found in the investigation lineage.",
      investigationId,
      target,
    };
  }

  if (target.edgeId && !lineage.edges.some((edge) => edge.id === target.edgeId)) {
    return {
      valid: false,
      reason: "The requested remediation edge could not be found in the investigation lineage.",
      investigationId,
      target,
    };
  }

  if (target.sourceId && !lineage.nodes.some((node) => node.id === target.sourceId)) {
    if (action !== "RepairReference") {
      return {
        valid: false,
        reason:
          "The requested remediation source node could not be found in the investigation lineage.",
        investigationId,
        target,
      };
    }

    if (!target.targetId || !lineage.nodes.some((node) => node.id === target.targetId)) {
      return {
        valid: false,
        reason:
          "The broken reference source is missing and its owning target could not be resolved.",
        investigationId,
        target,
      };
    }
  }

  if (target.targetId && !lineage.nodes.some((node) => node.id === target.targetId)) {
    return {
      valid: false,
      reason:
        "The requested remediation target node could not be found in the investigation lineage.",
      investigationId,
      target,
    };
  }

  if (!target.nodeId && !target.edgeId && !target.sourceId && !target.targetId) {
    return {
      valid: false,
      reason: "No remediation target was provided.",
      investigationId,
      target,
    };
  }

  return {
    valid: true,
    reason: "The remediation target is valid for the investigation.",
    investigationId,
    target,
  };
}

export function resolveResearchLineageIntegrityRemediationTarget(
  investigationId: string,
  target: ResearchLineageIntegrityActionTarget,
  action?: ResearchLineageIntegrityRemediationPlan["action"],
): ResearchLineageIntegrityResolvedRemediationTarget {
  const lineage = getResearchLineage(investigationId);

  if (lineage.investigationId !== investigationId) {
    return {
      investigationId,
      kind: "Relationship",
      resolvable: false,
      reason: "The remediation target does not belong to the requested investigation.",
    };
  }

  /*
   * RepairReference is special: the source node may be
   * intentionally missing because that missing reference
   * is exactly what the remediation will replace.
   *
   * Resolve the owning target node instead.
   */
  if (action === "RepairReference" && target.targetId) {
    const targetNode = lineage.nodes.find((node) => node.id === target.targetId);

    if (!targetNode) {
      return {
        investigationId,
        kind: "Relationship",
        entityId: target.targetId,
        resolvable: false,
        reason: "The owning remediation target could not be resolved in the investigation lineage.",
      };
    }

    return {
      investigationId,
      kind: targetNode.type,
      entityId: targetNode.id,
      sourceId: target.sourceId,
      targetId: target.targetId,
      relationshipType: "Supports",
      resolvable: true,
      reason:
        "The owning target for the broken reference was resolved; the missing source is eligible for deterministic reference replacement.",
    };
  }

  /*
   * Relationship targets are derived from canonical
   * source/target records. Resolve them first because
   * an edge is more specific than an individual node.
   */
  if (target.edgeId) {
    const edge = lineage.edges.find((candidate) => candidate.id === target.edgeId);

    if (!edge) {
      return {
        investigationId,
        kind: "Relationship",
        resolvable: false,
        reason:
          "The requested remediation relationship could not be found in the investigation lineage.",
      };
    }

    const source = lineage.nodes.find((node) => node.id === edge.sourceId);

    const targetNode = lineage.nodes.find((node) => node.id === edge.targetId);

    if (!source || !targetNode) {
      return {
        investigationId,
        kind: "Relationship",
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        relationshipType: edge.type,
        resolvable: false,
        reason:
          "The remediation relationship cannot be resolved because one or both endpoint nodes are missing.",
      };
    }

    return {
      investigationId,
      kind: "Relationship",
      sourceId: edge.sourceId,
      targetId: edge.targetId,
      relationshipType: edge.type,
      resolvable: true,
      reason: "The remediation relationship was resolved from the investigation lineage.",
    };
  }

  /*
   * Resolve an explicit node target.
   */
  const nodeId = target.nodeId ?? target.sourceId ?? target.targetId;

  if (!nodeId) {
    return {
      investigationId,
      kind: "Relationship",
      resolvable: false,
      reason: "No resolvable remediation target was provided.",
    };
  }

  const node = lineage.nodes.find((candidate) => candidate.id === nodeId);

  if (!node) {
    return {
      investigationId,
      kind: "Relationship",
      entityId: nodeId,
      resolvable: false,
      reason: "The requested remediation node could not be resolved in the investigation lineage.",
    };
  }

  switch (node.type) {
    case "Investigation": {
      const exists = getResearchInvestigations().some((item) => item.id === node.id);

      return {
        investigationId,
        kind: "Investigation",
        entityId: node.id,
        resolvable: exists,
        reason: exists
          ? "The investigation remediation target resolves to a canonical investigation record."
          : "The investigation lineage node exists, but its canonical investigation record could not be resolved.",
      };
    }

    case "Experiment": {
      const exists = getResearchExperiments().some((item) => item.id === node.id);

      return {
        investigationId,
        kind: "Experiment",
        entityId: node.id,
        resolvable: exists,
        reason: exists
          ? "The experiment remediation target resolves to a canonical experiment record."
          : "The experiment lineage node exists, but its canonical experiment record could not be resolved.",
      };
    }

    case "Evidence": {
      const exists = getResearchEvidence().some((item) => item.id === node.id);

      return {
        investigationId,
        kind: "Evidence",
        entityId: node.id,
        resolvable: exists,
        reason: exists
          ? "The evidence remediation target resolves to a canonical evidence record."
          : "The evidence lineage node exists, but its canonical evidence record could not be resolved.",
      };
    }

    case "Finding": {
      const exists = getResearchFindings().some((item) => item.id === node.id);

      return {
        investigationId,
        kind: "Finding",
        entityId: node.id,
        resolvable: exists,
        reason: exists
          ? "The finding remediation target resolves to a canonical finding record."
          : "The finding lineage node exists, but its canonical finding record could not be resolved.",
      };
    }

    case "FindingValidation": {
      const exists = getResearchFindingValidations().some((item) => item.id === node.id);

      return {
        investigationId,
        kind: "FindingValidation",
        entityId: node.id,
        resolvable: exists,
        reason: exists
          ? "The finding-validation remediation target resolves to a canonical validation record."
          : "The finding-validation lineage node exists, but its canonical validation record could not be resolved.",
      };
    }

    case "Conclusion": {
      const exists = getResearchInvestigationConclusions().some((item) => item.id === node.id);

      return {
        investigationId,
        kind: "Conclusion",
        entityId: node.id,
        resolvable: exists,
        reason: exists
          ? "The conclusion remediation target resolves to a canonical conclusion record."
          : "The conclusion lineage node exists, but its canonical conclusion record could not be resolved.",
      };
    }

    default: {
      return {
        investigationId,
        kind: "Relationship",
        entityId: node.id,
        resolvable: false,
        reason: "The remediation target uses an unsupported lineage node type.",
      };
    }
  }
}
export function preflightResearchLineageIntegrityRemediation(
  plan: ResearchLineageIntegrityRemediationPlan,
): ResearchLineageIntegrityRemediationExecutionPreflight {
  const policy = getResearchLineageIntegrityRemediationExecutionPolicy(plan.action);

  const targetValidation = validateResearchLineageIntegrityRemediationTarget(
    plan.investigationId,
    plan.target,
    plan.action,
  );

  if (!plan.confirmed) {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      policy,
      targetValidation,
      confirmed: false,
      ready: false,
      reason: "Remediation execution requires explicit confirmation.",
    };
  }

  if (!targetValidation.valid) {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      policy,
      targetValidation,
      confirmed: true,
      ready: false,
      reason: targetValidation.reason,
    };
  }

  return {
    investigationId: plan.investigationId,
    action: plan.action,
    issueCode: plan.issueCode,
    policy,
    targetValidation,
    confirmed: true,
    ready: true,
    reason: "Remediation passed confirmation, execution-policy, and target-validation checks.",
  };
}

export function executeResearchLineageIntegrityRemediation(
  plan: ResearchLineageIntegrityRemediationPlan,
): ResearchLineageIntegrityRemediationResult {
  return analyzeExecuteResearchLineageIntegrityRemediation(
    plan,
    {
      getResearchLineageIntegrityRemediationExecutionPolicy,
      validateResearchLineageIntegrityRemediationTarget,
      resolveResearchLineageIntegrityRemediationTarget,
      getResearchLineageRemediationEntityUpdatedAt,
      getResearchLineageRemediationReplacement,
      decideResearchLineageIntegrityRemediationRepair,
      executeResearchLineageIntegrityRemediationRepair,
    },
  );
}

export function getResearchLineageIntegrityRemediationPreview(
  issue: ResearchLineageIntegrityIssue,
): ResearchLineageIntegrityRemediationPreview | null {
  const action = getResearchLineageIntegrityIssueAction(issue);

  if (action.action === "Inspect" || action.action === "ReviewProvenance") {
    return null;
  }

  return {
    title: `Proposed ${action.label.toLowerCase()}`,
    description: `This action would address ${issue.code} using the proposed ${action.action} remediation. No research data will be changed until confirmation is explicitly provided.`,
    action: action.action,
    issueCode: issue.code,
    target: action.target,
    requiresConfirmation: action.requiresConfirmation,
  };
}

export function getResearchLineageIntegrityInspectionNodeId(
  issue: ResearchLineageIntegrityIssue,
  lineage: ResearchLineage,
): string | null {
  if (issue.nodeId) {
    return lineage.nodes.some((node) => node.id === issue.nodeId) ? issue.nodeId : null;
  }

  if (issue.sourceId) {
    const sourceExists = lineage.nodes.some((node) => node.id === issue.sourceId);

    if (sourceExists) {
      return issue.sourceId;
    }
  }

  if (issue.targetId) {
    const targetExists = lineage.nodes.some((node) => node.id === issue.targetId);

    if (targetExists) {
      return issue.targetId;
    }
  }

  if (issue.edgeId) {
    const edge = lineage.edges.find((candidate) => candidate.id === issue.edgeId);

    if (edge) {
      const sourceExists = lineage.nodes.some((node) => node.id === edge.sourceId);

      if (sourceExists) {
        return edge.sourceId;
      }

      const targetExists = lineage.nodes.some((node) => node.id === edge.targetId);

      if (targetExists) {
        return edge.targetId;
      }
    }
  }

  return null;
}

export function validateResearchLineage(
  investigationId: string,
): ResearchLineageIntegrityResult {
  return analyzeResearchLineage(
    investigationId,
    {
      getResearchLineage,
      validateResearchProvenanceIntegrity,
    },
  );
}

export function validateResearchLineageForInvestigation(
  investigationId: string,
): ResearchLineageIntegrityResult {
  return validateResearchLineage(investigationId);
}

export function getResearchProvenanceEventsByEventType(
  eventType: ResearchProvenanceEventType,
): ResearchProvenanceEvent[] {
  return filterResearchProvenanceEventsByEventType(
    getResearchProvenanceEvents(),
    eventType,
  );
}

export function validateResearchProvenanceIntegrity(): ResearchProvenanceIntegrityResult {
  return analyzeResearchProvenanceIntegrity({
    getResearchProvenanceEvents,
    getResearchInvestigations,
    getResearchExperiments,
    getResearchFindings,
    getResearchFindingValidations,
    getResearchInvestigationConclusions,
  });
}

export function getResearchProvenanceIntegritySummary(): ResearchProvenanceIntegritySummary {
  const result = validateResearchProvenanceIntegrity();

  const issueCodes = Array.from(new Set(result.issues.map((issue) => issue.code)));

  return {
    valid: result.valid,

    checkedEventCount: result.checkedEventCount,

    issueCount: result.issues.length,

    issueCodes,
  };
}

export function saveResearchProvenanceEvent(
  event: ResearchProvenanceEvent,
): void {
  researchProvenanceRepository.saveResearchProvenanceEvent(event);
}

export function createResearchProvenanceEvent(
  input: Omit<ResearchProvenanceEvent, "id" | "timestamp">,
): ResearchProvenanceEvent {
  return researchProvenanceRepository.createResearchProvenanceEvent(input);
}
/* -------------------------------------------------------------------------- */
/*                              Subscription                                  */
/* -------------------------------------------------------------------------- */

export function subscribeToResearch(callback: () => void): () => void {
  return researchPersistence.subscribe(callback);
}
