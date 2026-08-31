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
  createResearchProvenanceEventService,
} from "./provenance/events";

import {
  validateResearchProvenanceIntegrity as analyzeResearchProvenanceIntegrity,
} from "./provenance/integrity";

import {
  createResearchProvenanceRepository,
} from "./provenance/repository";

import {
  createResearchFindingValidationService,
} from "./validation/lifecycle";

import {
  createResearchValidationRepository,
} from "./validation/repository";

import {
  getResearchLineageIntegrityIssueAction as analyzeGetResearchLineageIntegrityIssueAction,
  createResearchLineageIntegrityRemediationRequest as analyzeCreateResearchLineageIntegrityRemediationRequest,
  getResearchLineageRemediationReplacement as analyzeGetResearchLineageRemediationReplacement,
  createResearchLineageIntegrityRemediationPlan as analyzeCreateResearchLineageIntegrityRemediationPlan,
  getResearchLineageIntegrityRemediationExecutionPolicy as analyzeGetResearchLineageIntegrityRemediationExecutionPolicy,
  validateResearchLineageIntegrityRemediationTarget as analyzeValidateResearchLineageIntegrityRemediationTarget,
  resolveResearchLineageIntegrityRemediationTarget as analyzeResolveResearchLineageIntegrityRemediationTarget,
} from "./lineage/remediation/planning";

import {
  executeResearchLineageIntegrityRemediation as analyzeExecuteResearchLineageIntegrityRemediation,
} from "./lineage/remediation/execution";

import {
  createResearchLineageRemediationRepairService,
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
  createResearchExperimentLifecycleService,
} from "./experiment/lifecycle";

import {
  createResearchExperimentRepository,
} from "./experiment/repository";

import {
  createResearchEvidenceAssessmentService,
} from "./evidence/assessment";

import {
  createResearchEvidenceRepository,
} from "./evidence/repository";

import {
  createResearchFindingRepository,
} from "./finding/repository";

import {
  createResearchInvestigationRepository,
} from "./investigation/repository";

import {
  createResearchConclusionRepository,
} from "./conclusion/repository";

import {
  createResearchConclusionLifecycleService,
} from "./conclusion/lifecycle";

const researchPersistence = localResearchPersistence;

const researchValidationRepository =
  createResearchValidationRepository({
    loadResearchFindingValidations: () =>
      researchPersistence.load().findingValidations,

    saveResearchFindingValidations: (validations) =>
      researchPersistence.saveFindingValidations(validations),

    loadResearchFindingValidationHistory: () =>
      researchPersistence.load().findingValidationHistory,

    saveResearchFindingValidationHistory: (history) =>
      researchPersistence.saveFindingValidationHistory(history),
  });

const researchFindingRepository =
  createResearchFindingRepository({
    loadResearchFindings: () =>
      researchPersistence.load().findings,

    saveResearchFindings: (findings) =>
      researchPersistence.saveFindings(findings),

    createId,

    now: () => new Date().toISOString(),
  });

const researchEvidenceRepository =
  createResearchEvidenceRepository({
    loadResearchEvidence: () =>
      researchPersistence.load().evidence,

    saveResearchEvidence: (evidence) =>
      researchPersistence.saveEvidence(evidence),
  });

const researchExperimentRepository =
  createResearchExperimentRepository({
    loadResearchExperiments: () =>
      researchPersistence.load().experiments,

    saveResearchExperiments: (experiments) =>
      researchPersistence.saveExperiments(experiments),
  });

const researchProvenanceRepository =
  createResearchProvenanceRepository({
    loadResearchProvenanceEvents: () =>
      researchPersistence.load().provenanceEvents,

    saveResearchProvenanceEvents: (events) =>
      researchPersistence.saveProvenanceEvents(events),

    createId,

    now: () => new Date().toISOString(),
  });

const researchProvenanceEventService =
  createResearchProvenanceEventService({
    getResearchProvenanceEvents,
    getResearchFindingValidations,
    getResearchFindings,
    validateResearchProvenanceIntegrity,
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

const researchConclusionRepository =
  createResearchConclusionRepository({
    loadResearchInvestigationConclusions: () =>
      researchPersistence.load().investigationConclusions,

    saveResearchInvestigationConclusions: (conclusions) =>
      researchPersistence.saveInvestigationConclusions(conclusions),

    getResearchInvestigations: () => getResearchInvestigations(),
    saveResearchInvestigation: (investigation) =>
      saveResearchInvestigation(investigation),

    createId,
    now: () => new Date().toISOString(),
  });

const researchEvidenceAssessmentService =
  createResearchEvidenceAssessmentService({
    getResearchFindings,
    saveResearchFinding,
    createId,
    now: () => new Date().toISOString(),
  });

const researchFindingValidationService =
  createResearchFindingValidationService({
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
  });

const researchExperimentLifecycleService =
  createResearchExperimentLifecycleService({
    saveResearchExperiment,
    createResearchProvenanceEvent,
    createId,
    now: () => new Date().toISOString(),
  });

const researchConclusionLifecycleService =
  createResearchConclusionLifecycleService({
    getResearchFindings,
    getResearchFindingValidations,
    saveResearchInvestigationConclusion,
    createResearchProvenanceEvent,
    now: () => new Date().toISOString(),
  });

const researchLineageRemediationRepairService =
  createResearchLineageRemediationRepairService({
    getResearchInvestigations,
    getResearchFindings,
    getResearchInvestigationConclusions,
    resolveResearchLineageIntegrityRemediationTarget,
    saveResearchInvestigationConclusion,
    createResearchProvenanceEvent,
    validateResearchLineage,
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
  return researchExperimentLifecycleService
    .canTransitionResearchExperiment(from, to);
}

export function transitionResearchExperiment(
  experiment: ResearchExperiment,
  to: ResearchStatus,
  reason?: string,
): ResearchExperiment | null {
  return researchExperimentLifecycleService
    .transitionResearchExperiment(
      experiment,
      to,
      reason,
    );
}

export interface ResearchConclusionAcceptanceResult {
  eligible: boolean;
  reasons: string[];
  supportingFindingCount: number;
  validatedFindingCount: number;
}

export function canTransitionResearchInvestigationConclusion(
  from: ResearchConclusionStatus,
  to: ResearchConclusionStatus,
): boolean {
  return researchConclusionLifecycleService
    .canTransitionResearchInvestigationConclusion(
      from,
      to,
    );
}

export function evaluateResearchInvestigationConclusionAcceptance(
  conclusion: ResearchInvestigationConclusion,
): ResearchConclusionAcceptanceResult {
  return researchConclusionLifecycleService
    .evaluateResearchInvestigationConclusionAcceptance(
      conclusion,
    );
}

export function transitionResearchInvestigationConclusion(
  conclusion: ResearchInvestigationConclusion,
  to: ResearchConclusionStatus,
): ResearchInvestigationConclusion | null {
  return researchConclusionLifecycleService
    .transitionResearchInvestigationConclusion(
      conclusion,
      to,
    );
}

/* -------------------------------------------------------------------------- */
/*                              Experiments                                   */
/* -------------------------------------------------------------------------- */

export function getResearchExperiments(): ResearchExperiment[] {
  return researchExperimentRepository.getResearchExperiments();
}

export function saveResearchExperiment(
  experiment: ResearchExperiment,
): void {
  researchExperimentRepository.saveResearchExperiment(
    experiment,
  );
}

/* -------------------------------------------------------------------------- */
/*                               Evidence                                     */
/* -------------------------------------------------------------------------- */

export function getResearchEvidence(): ResearchEvidence[] {
  return researchEvidenceRepository.getResearchEvidence();
}

export function saveResearchEvidence(
  evidence: ResearchEvidence,
): void {
  researchEvidenceRepository.saveResearchEvidence(
    evidence,
  );
}
/* -------------------------------------------------------------------------- */
/*                               Findings                                     */
/* -------------------------------------------------------------------------- */

export function getResearchFindings(): ResearchFinding[] {
  return researchFindingRepository.getResearchFindings();
}

export function saveResearchFinding(
  finding: ResearchFinding,
): void {
  researchFindingRepository.saveResearchFinding(
    finding,
  );
}
/* -------------------------------------------------------------------------- */
/*                         Finding Validation                                 */
/* -------------------------------------------------------------------------- */

export function getResearchFindingValidations(): ResearchFindingValidation[] {
  return researchValidationRepository.getResearchFindingValidations();
}

export function saveResearchFindingValidation(
  validation: ResearchFindingValidation,
): void {
  researchValidationRepository.saveResearchFindingValidation(
    validation,
  );
}

export function getResearchFindingValidationHistory(): ResearchFindingValidationHistoryEvent[] {
  return researchValidationRepository.getResearchFindingValidationHistory();
}

export function saveResearchFindingValidationHistoryEvent(
  event: ResearchFindingValidationHistoryEvent,
): void {
  researchValidationRepository.saveResearchFindingValidationHistoryEvent(
    event,
  );
}

export function canTransitionResearchFindingValidation(
  from: ResearchValidationStatus,
  to: ResearchValidationStatus,
): boolean {
  return researchFindingValidationService
    .canTransitionResearchFindingValidation(
      from,
      to,
    );
}

export function transitionResearchFindingValidation(
  validationId: string,
  to: ResearchValidationStatus,
  reason?: string,
): ResearchFindingValidation | null {
  return researchFindingValidationService
    .transitionResearchFindingValidation(
      validationId,
      to,
      reason,
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
  return researchFindingValidationService
    .createResearchFindingValidation(
      findingId,
      input,
    );
}

/* -------------------------------------------------------------------------- */
/*                    Investigation Conclusions                              */
/* -------------------------------------------------------------------------- */

export function getResearchInvestigationConclusions(): ResearchInvestigationConclusion[] {
  return researchConclusionRepository.getResearchInvestigationConclusions();
}

export function saveResearchInvestigationConclusion(
  conclusion: ResearchInvestigationConclusion,
): void {
  researchConclusionRepository.saveResearchInvestigationConclusion(
    conclusion,
  );
}

export function createResearchInvestigationConclusion(
  input: Omit<
    ResearchInvestigationConclusion,
    "id" | "createdAt" | "updatedAt"
  >,
): ResearchInvestigationConclusion {
  return researchConclusionRepository.createResearchInvestigationConclusion(
    input,
  );
}

export function attachResearchInvestigationConclusion(
  investigationId: string,
  conclusionId: string,
): ResearchInvestigation | null {
  return researchConclusionRepository.attachResearchInvestigationConclusion(
    investigationId,
    conclusionId,
  );
}

export function detachResearchInvestigationConclusion(
  investigationId: string,
  conclusionId: string,
): ResearchInvestigation | null {
  return researchConclusionRepository.detachResearchInvestigationConclusion(
    investigationId,
    conclusionId,
  );
}
export function createResearchEvidenceAssessment(
  input: Omit<
    ResearchEvidenceAssessment,
    "id" | "assessedAt" | "updatedAt"
  >,
): ResearchEvidenceAssessment {
  return researchEvidenceAssessmentService
    .createResearchEvidenceAssessment(input);
}

export function updateResearchFindingEvidenceAssessment(
  findingId: string,
  assessment: ResearchEvidenceAssessment,
): ResearchFinding | null {
  return researchEvidenceAssessmentService
    .updateResearchFindingEvidenceAssessment(
      findingId,
      assessment,
    );
}

export function removeResearchFindingEvidenceAssessment(
  findingId: string,
  assessmentId: string,
): ResearchFinding | null {
  return researchEvidenceAssessmentService
    .removeResearchFindingEvidenceAssessment(
      findingId,
      assessmentId,
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
  return researchProvenanceEventService
    .getResearchProvenanceEventsByInvestigation(
      getResearchProvenanceEvents(),
      investigationId,
    );
}

export function getResearchProvenanceEventsByEntity(
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent[] {
  return researchProvenanceEventService
    .getResearchProvenanceEventsByEntity(
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
  return researchProvenanceEventService
    .getResearchProvenanceEventsByInvestigationAndEntity(
      getResearchProvenanceEvents(),
      investigationId,
      entityType,
      entityId,
    );
}

export function getResearchProvenanceEventsChronological(): ResearchProvenanceEvent[] {
  return researchProvenanceEventService
    .getResearchProvenanceEventsChronological(
      getResearchProvenanceEvents(),
    );
}

export function getResearchProvenanceTimeline(): ResearchProvenanceTimelineItem[] {
  return researchProvenanceEventService
    .getResearchProvenanceTimeline();
}

export function getResearchProvenanceTimelineByInvestigation(
  investigationId: string,
): ResearchProvenanceTimelineItem[] {
  return researchProvenanceEventService
    .getResearchProvenanceTimelineByInvestigation(
      investigationId,
    );
}

export function getResearchProvenanceInvestigationSummary(
  investigationId: string,
): ResearchProvenanceInvestigationSummary {
  return researchProvenanceEventService
    .getResearchProvenanceInvestigationSummary(
      investigationId,
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
  return researchProvenanceEventService
    .getResearchProvenanceEventsByInvestigationChronological(
      getResearchProvenanceEvents(),
      investigationId,
    );
}

export function getLatestResearchProvenanceEvent(
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent | null {
  return researchProvenanceEventService
    .getLatestResearchProvenanceEvent(
      getResearchProvenanceEvents(),
      entityType,
      entityId,
    );
}

export function discoverResearchLineageIntegrityRemediationReplacement(
  plan: ResearchLineageIntegrityRemediationPlan,
): ResearchLineageIntegrityRemediationReplacementDiscoveryResult {
  return researchLineageRemediationRepairService
    .discoverResearchLineageIntegrityRemediationReplacement(plan);
}

export function decideResearchLineageIntegrityRemediationRepair(
  plan: ResearchLineageIntegrityRemediationPlan,
): ResearchLineageIntegrityRemediationRepairDecisionResult {
  return researchLineageRemediationRepairService
    .decideResearchLineageIntegrityRemediationRepair(plan);
}

export function createResearchLineageIntegrityRemediationMutationContract(
  decision: ResearchLineageIntegrityRemediationRepairDecisionResult,
): ResearchLineageIntegrityRemediationMutationContract | null {
  return researchLineageRemediationRepairService
    .createResearchLineageIntegrityRemediationMutationContract(
      decision,
    );
}

export function executeResearchLineageIntegrityRemediationRepair(
  decision: ResearchLineageIntegrityRemediationRepairDecisionResult,
): ResearchLineageIntegrityRemediationRepairExecutionResult {
  return researchLineageRemediationRepairService
    .executeResearchLineageIntegrityRemediationRepair(
      decision,
    );
}

/* -------------------------------------------------------------------------- */
/*                    Lineage Integrity Issue Actions                         */
/* -------------------------------------------------------------------------- */

export function getResearchLineageIntegrityIssueAction(
  issue: ResearchLineageIntegrityIssue,
): ResearchLineageIntegrityIssueAction {
  return analyzeGetResearchLineageIntegrityIssueAction(issue);
}

export function createResearchLineageIntegrityRemediationRequest(
  investigationId: string,
  issue: ResearchLineageIntegrityIssue,
  confirmed: boolean,
  replacementEntityId?: string,
): ResearchLineageIntegrityRemediationRequest | null {
  return analyzeCreateResearchLineageIntegrityRemediationRequest(
    investigationId,
    issue,
    confirmed,
    replacementEntityId,
  );
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
  replacementEntityId?: string,
): ResearchFinding | undefined {
  return analyzeGetResearchLineageRemediationReplacement(
    investigationId,
    replacementEntityId,
    {
      getResearchInvestigations,
      getResearchExperiments,
      getResearchEvidence,
      getResearchFindings,
      getResearchFindingValidations,
      getResearchInvestigationConclusions,
      getResearchLineage,
    },
  );
}

export function createResearchLineageIntegrityRemediationPlan(
  request: ResearchLineageIntegrityRemediationRequest,
): ResearchLineageIntegrityRemediationPlan {
  return analyzeCreateResearchLineageIntegrityRemediationPlan(
    request,
    {
      getResearchLineage,
      getResearchInvestigations,
      getResearchExperiments,
      getResearchEvidence,
      getResearchFindings,
      getResearchFindingValidations,
      getResearchInvestigationConclusions,
    },
  );
}

export function getResearchLineageIntegrityRemediationExecutionPolicy(
  action: ResearchLineageIntegrityRemediationRequest["action"],
): ResearchLineageIntegrityRemediationExecutionPolicy {
  return analyzeGetResearchLineageIntegrityRemediationExecutionPolicy(action);
}

export function validateResearchLineageIntegrityRemediationTarget(
  investigationId: string,
  target: ResearchLineageIntegrityActionTarget,
  action: ResearchLineageIntegrityRemediationPlan["action"] | undefined,
): ResearchLineageIntegrityRemediationTargetValidation {
  return analyzeValidateResearchLineageIntegrityRemediationTarget(
    investigationId,
    target,
    action,
    {
      getResearchLineage,
      getResearchInvestigations,
      getResearchExperiments,
      getResearchEvidence,
      getResearchFindings,
      getResearchFindingValidations,
      getResearchInvestigationConclusions,
    },
  );
}

export function resolveResearchLineageIntegrityRemediationTarget(
  investigationId: string,
  target: ResearchLineageIntegrityActionTarget,
  action: ResearchLineageIntegrityRemediationPlan["action"] | undefined,
): ResearchLineageIntegrityResolvedRemediationTarget {
  return analyzeResolveResearchLineageIntegrityRemediationTarget(
    investigationId,
    target,
    action,
    {
      getResearchLineage,
      getResearchInvestigations,
      getResearchExperiments,
      getResearchEvidence,
      getResearchFindings,
      getResearchFindingValidations,
      getResearchInvestigationConclusions,
    },
  );
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
  return researchProvenanceEventService
    .getResearchProvenanceEventsByEventType(
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
