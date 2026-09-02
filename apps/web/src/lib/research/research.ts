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
  createResearchProvenanceEventService,
} from "./provenance/events";

import {
  createResearchProvenanceIntegrityService,
} from "./provenance/service";

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
  createResearchLineageRemediationPlanningService,
} from "./lineage/remediation/planning";

import {
  createResearchLineageRemediationExecutionService,
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
  createResearchLineageService,
} from "./lineage/service";

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

const researchProvenanceIntegrityService =
  createResearchProvenanceIntegrityService({
    getResearchProvenanceEvents,
    getResearchInvestigations,
    getResearchExperiments,
    getResearchFindings,
    getResearchFindingValidations,
    getResearchInvestigationConclusions,
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

const researchLineageService =
  createResearchLineageService({
    getResearchInvestigations,
    getResearchExperiments,
    getResearchEvidence,
    getResearchFindings,
    getResearchFindingValidations,
    getResearchInvestigationConclusions,
    getResearchProvenanceEventsByInvestigation,
    validateResearchProvenanceIntegrity,
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

const researchLineageRemediationPlanningService =
  createResearchLineageRemediationPlanningService({
    getResearchLineage,
    getResearchInvestigations,
    getResearchExperiments,
    getResearchEvidence,
    getResearchFindings,
    getResearchFindingValidations,
    getResearchInvestigationConclusions,
  });

const researchLineageRemediationExecutionService =
  createResearchLineageRemediationExecutionService({
    getResearchLineageIntegrityRemediationExecutionPolicy,
    validateResearchLineageIntegrityRemediationTarget,
    resolveResearchLineageIntegrityRemediationTarget,
    getResearchLineageRemediationEntityUpdatedAt:
      researchLineageRemediationPlanningService
        .getResearchLineageRemediationEntityUpdatedAt,
    getResearchLineageRemediationReplacement,
    decideResearchLineageIntegrityRemediationRepair,
    executeResearchLineageIntegrityRemediationRepair,
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
  return researchLineageService.getResearchLineage(
    investigationId,
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
  return researchLineageRemediationPlanningService
    .getResearchLineageIntegrityIssueAction(issue);
}

export function createResearchLineageIntegrityRemediationRequest(
  investigationId: string,
  issue: ResearchLineageIntegrityIssue,
  confirmed: boolean,
  replacementEntityId?: string,
): ResearchLineageIntegrityRemediationRequest | null {
  return researchLineageRemediationPlanningService
    .createResearchLineageIntegrityRemediationRequest(
      investigationId,
      issue,
      confirmed,
      replacementEntityId,
    );
}

export function getResearchLineageRemediationReplacement(
  investigationId: string,
  replacementEntityId?: string,
): ResearchFinding | undefined {
  return researchLineageRemediationPlanningService
    .getResearchLineageRemediationReplacement(
      investigationId,
      replacementEntityId,
    );
}

export function createResearchLineageIntegrityRemediationPlan(
  request: ResearchLineageIntegrityRemediationRequest,
): ResearchLineageIntegrityRemediationPlan {
  return researchLineageRemediationPlanningService
    .createResearchLineageIntegrityRemediationPlan(
      request,
    );
}

export function getResearchLineageIntegrityRemediationExecutionPolicy(
  action: ResearchLineageIntegrityRemediationRequest["action"],
): ResearchLineageIntegrityRemediationExecutionPolicy {
  return researchLineageRemediationPlanningService
    .getResearchLineageIntegrityRemediationExecutionPolicy(
      action,
    );
}

export function validateResearchLineageIntegrityRemediationTarget(
  investigationId: string,
  target: ResearchLineageIntegrityActionTarget,
  action:
    | ResearchLineageIntegrityRemediationPlan["action"]
    | undefined,
): ResearchLineageIntegrityRemediationTargetValidation {
  return researchLineageRemediationPlanningService
    .validateResearchLineageIntegrityRemediationTarget(
      investigationId,
      target,
      action,
    );
}

export function resolveResearchLineageIntegrityRemediationTarget(
  investigationId: string,
  target: ResearchLineageIntegrityActionTarget,
  action:
    | ResearchLineageIntegrityRemediationPlan["action"]
    | undefined,
): ResearchLineageIntegrityResolvedRemediationTarget {
  return researchLineageRemediationPlanningService
    .resolveResearchLineageIntegrityRemediationTarget(
      investigationId,
      target,
      action,
    );
}

export function preflightResearchLineageIntegrityRemediation(
  plan: ResearchLineageIntegrityRemediationPlan,
): ResearchLineageIntegrityRemediationExecutionPreflight {
  return researchLineageRemediationExecutionService
    .preflightResearchLineageIntegrityRemediation(plan);
}

export function executeResearchLineageIntegrityRemediation(
  plan: ResearchLineageIntegrityRemediationPlan,
): ResearchLineageIntegrityRemediationResult {
  return researchLineageRemediationExecutionService
    .executeResearchLineageIntegrityRemediation(plan);
}

export function getResearchLineageIntegrityRemediationPreview(
  issue: ResearchLineageIntegrityIssue,
): ResearchLineageIntegrityRemediationPreview | null {
  return researchLineageRemediationPlanningService
    .getResearchLineageIntegrityRemediationPreview(issue);
}

export function getResearchLineageIntegrityInspectionNodeId(
  issue: ResearchLineageIntegrityIssue,
  lineage: ResearchLineage,
): string | null {
  return researchLineageRemediationPlanningService
    .getResearchLineageIntegrityInspectionNodeId(issue, lineage);
}

export function validateResearchLineage(
  investigationId: string,
): ResearchLineageIntegrityResult {
  return researchLineageService.validateResearchLineage(
    investigationId,
  );
}

export function validateResearchLineageForInvestigation(
  investigationId: string,
): ResearchLineageIntegrityResult {
  return researchLineageService
    .validateResearchLineageForInvestigation(
      investigationId,
    );
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
  return researchProvenanceIntegrityService
    .validateResearchProvenanceIntegrity();
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
