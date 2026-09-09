import "server-only";

import type {
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRepairDecisionResult,
  ResearchLineageIntegrityRemediationRepairExecutionResult,
  ResearchLineageIntegrityRemediationTargetValidation,
  ResearchLineageIntegrityResolvedRemediationTarget,
} from "@/types/research";

import {
  getResearchEvidence,
  getResearchExperiments,
  getResearchFindingValidations,
  getResearchFindings,
  getResearchInvestigations,
  getResearchInvestigationConclusions,
  getResearchProvenanceEvents,
} from "../../serverRepository";

import { createResearchLineageService } from "../service";

import { validateResearchProvenanceIntegrity } from "../../provenance/integrity";

import {
  decideResearchLineageIntegrityRemediationRepair,
  prepareResearchLineageIntegrityRemediationMutation,
} from "./repair";

import { createResearchLineageRemediationPlanningService } from "./planning";

import { researchLineageRemediationDatabasePersistence } from "./server";

interface ServerResearchSnapshot {
  getResearchInvestigations: Awaited<ReturnType<typeof getResearchInvestigations>>;
  getResearchExperiments: Awaited<ReturnType<typeof getResearchExperiments>>;
  getResearchEvidence: Awaited<ReturnType<typeof getResearchEvidence>>;
  getResearchFindings: Awaited<ReturnType<typeof getResearchFindings>>;
  getResearchFindingValidations: Awaited<ReturnType<typeof getResearchFindingValidations>>;
  getResearchInvestigationConclusions: Awaited<
    ReturnType<typeof getResearchInvestigationConclusions>
  >;
  getResearchProvenanceEvents: Awaited<ReturnType<typeof getResearchProvenanceEvents>>;
}

async function loadServerResearchSnapshot(): Promise<ServerResearchSnapshot> {
  const [
    investigations,
    experiments,
    evidence,
    findings,
    findingValidations,
    investigationConclusions,
    provenanceEvents,
  ] = await Promise.all([
    getResearchInvestigations(),
    getResearchExperiments(),
    getResearchEvidence(),
    getResearchFindings(),
    getResearchFindingValidations(),
    getResearchInvestigationConclusions(),
    getResearchProvenanceEvents(),
  ]);

  return {
    getResearchInvestigations: investigations,
    getResearchExperiments: experiments,
    getResearchEvidence: evidence,
    getResearchFindings: findings,
    getResearchFindingValidations: findingValidations,
    getResearchInvestigationConclusions: investigationConclusions,
    getResearchProvenanceEvents: provenanceEvents,
  };
}

function createServerLineageService(snapshot: ServerResearchSnapshot) {
  return createResearchLineageService({
    getResearchInvestigations: () => snapshot.getResearchInvestigations,
    getResearchExperiments: () => snapshot.getResearchExperiments,
    getResearchEvidence: () => snapshot.getResearchEvidence,
    getResearchFindings: () => snapshot.getResearchFindings,
    getResearchFindingValidations: () => snapshot.getResearchFindingValidations,
    getResearchInvestigationConclusions: () => snapshot.getResearchInvestigationConclusions,
    getResearchProvenanceEventsByInvestigation: (investigationId: string) =>
      snapshot.getResearchProvenanceEvents.filter(
        (event) => event.investigationId === investigationId,
      ),
    validateResearchProvenanceIntegrity: () =>
      validateResearchProvenanceIntegrity({
        getResearchProvenanceEvents: () => snapshot.getResearchProvenanceEvents,
        getResearchInvestigations: () => snapshot.getResearchInvestigations,
        getResearchExperiments: () => snapshot.getResearchExperiments,
        getResearchFindings: () => snapshot.getResearchFindings,
        getResearchFindingValidations: () => snapshot.getResearchFindingValidations,
        getResearchInvestigationConclusions: () => snapshot.getResearchInvestigationConclusions,
      }),
  });
}

function createServerPlanningService(snapshot: ServerResearchSnapshot) {
  const lineageService = createServerLineageService(snapshot);

  return createResearchLineageRemediationPlanningService({
    getResearchLineage: (investigationId: string) =>
      lineageService.getResearchLineage(investigationId),
    getResearchInvestigations: () => snapshot.getResearchInvestigations,
    getResearchExperiments: () => snapshot.getResearchExperiments,
    getResearchEvidence: () => snapshot.getResearchEvidence,
    getResearchFindings: () => snapshot.getResearchFindings,
    getResearchFindingValidations: () => snapshot.getResearchFindingValidations,
    getResearchInvestigationConclusions: () => snapshot.getResearchInvestigationConclusions,
  });
}

export async function executeResearchLineageIntegrityRemediationOnServer(
  plan: ResearchLineageIntegrityRemediationPlan,
): Promise<ResearchLineageIntegrityRemediationRepairExecutionResult> {
  if (!plan.confirmed) {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      executed: false,
      mutationType: null,
      message: "Remediation execution requires explicit confirmation.",
    };
  }

  if (
    plan.action !== "RepairReference" &&
    plan.action !== "RepairScope" &&
    plan.action !== "RepairRelationship"
  ) {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      executed: false,
      mutationType: null,
      message: `Remediation action ${plan.action} is not executable.`,
    };
  }

  const snapshot = await loadServerResearchSnapshot();
  const planningService = createServerPlanningService(snapshot);
  const targetValidation: ResearchLineageIntegrityRemediationTargetValidation =
    planningService.validateResearchLineageIntegrityRemediationTarget(
      plan.investigationId,
      plan.target,
      plan.action,
    );

  if (!targetValidation.valid) {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      executed: false,
      mutationType: null,
      message: targetValidation.reason,
    };
  }

  const resolvedTarget: ResearchLineageIntegrityResolvedRemediationTarget =
    planningService.resolveResearchLineageIntegrityRemediationTarget(
      plan.investigationId,
      plan.target,
      plan.action,
    );

  if (!resolvedTarget.resolvable) {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      executed: false,
      mutationType: null,
      message: `Execution target could not be resolved: ${resolvedTarget.reason}`,
    };
  }

  if (plan.targetUpdatedAt) {
    const currentTargetUpdatedAt =
      planningService.getResearchLineageRemediationEntityUpdatedAt(resolvedTarget);

    if (currentTargetUpdatedAt !== plan.targetUpdatedAt) {
      return {
        investigationId: plan.investigationId,
        action: plan.action,
        issueCode: plan.issueCode,
        executed: false,
        mutationType: null,
        message:
          "Remediation execution rejected because the target changed after the remediation plan was created.",
      };
    }
  }

  if (plan.replacementUpdatedAt !== undefined && plan.replacementEntityId) {
    const currentReplacement = planningService.getResearchLineageRemediationReplacement(
      plan.investigationId,
      plan.replacementEntityId,
    );

    if (currentReplacement?.updatedAt !== plan.replacementUpdatedAt) {
      return {
        investigationId: plan.investigationId,
        action: plan.action,
        issueCode: plan.issueCode,
        executed: false,
        mutationType: null,
        message:
          "Remediation execution rejected because the replacement changed after the remediation plan was created.",
      };
    }
  }

  const repairDecision: ResearchLineageIntegrityRemediationRepairDecisionResult =
    decideResearchLineageIntegrityRemediationRepair(plan, {
      getResearchInvestigations: () => snapshot.getResearchInvestigations,
      getResearchFindings: () => snapshot.getResearchFindings,
      getResearchInvestigationConclusions: () => snapshot.getResearchInvestigationConclusions,
      resolveResearchLineageIntegrityRemediationTarget: (investigationId, target, action) =>
        planningService.resolveResearchLineageIntegrityRemediationTarget(
          investigationId,
          target,
          action,
        ),
    });

  const preparation = prepareResearchLineageIntegrityRemediationMutation(repairDecision, {
    getResearchInvestigations: () => snapshot.getResearchInvestigations,
    getResearchFindings: () => snapshot.getResearchFindings,
    getResearchInvestigationConclusions: () => snapshot.getResearchInvestigationConclusions,
    resolveResearchLineageIntegrityRemediationTarget: (investigationId, target, action) =>
      planningService.resolveResearchLineageIntegrityRemediationTarget(
        investigationId,
        target,
        action,
      ),
  });

  if (!preparation.prepared) {
    return preparation.result;
  }

  const persistenceResult =
    await researchLineageRemediationDatabasePersistence.persistResearchLineageRemediationMutation({
      conclusion: preparation.mutation.updatedConclusion,
      expectedUpdatedAt: new Date(preparation.mutation.conclusion.updatedAt),
      provenance: preparation.mutation.provenanceInput,
    });

  const postMutationSnapshot = await loadServerResearchSnapshot();

  const postMutationLineageService = createServerLineageService(postMutationSnapshot);

  const validation = postMutationLineageService.validateResearchLineage(plan.investigationId);

  const postcondition = {
    validated: true,
    valid: validation.valid,
    issueCount: validation.issueCount,
    issues: validation.issues,
    checkedNodeCount: validation.checkedNodeCount,
    checkedEdgeCount: validation.checkedEdgeCount,
  };

  const remainingInvalidReference = validation.issues.some(
    (issue) =>
      issue.code === "CONCLUSION_FINDING_REFERENCE_INVALID" &&
      issue.targetId === preparation.mutation.updatedConclusion.id,
  );

  return {
    investigationId: plan.investigationId,
    action: plan.action,
    issueCode: plan.issueCode,
    executed: !remainingInvalidReference,
    mutationType: preparation.mutation.mutationContract.mutationType,
    provenanceEventId: persistenceResult.provenanceEventId,
    postcondition,
    message: remainingInvalidReference
      ? "The reference mutation was persisted, but lineage validation still reports an invalid conclusion finding reference."
      : `Deterministic reference repair completed: ${preparation.mutation.sourceId} was replaced with ${preparation.mutation.replacementFindingId} on conclusion ${preparation.mutation.updatedConclusion.id}.`,
  };
}
