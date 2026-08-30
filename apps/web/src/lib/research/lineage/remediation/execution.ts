import type {
  ResearchFinding,
  ResearchLineageIntegrityRemediationExecutionPolicy,
  ResearchLineageIntegrityRemediationExecutionPreflight,
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRequest,
  ResearchLineageIntegrityRemediationResult,
  ResearchLineageIntegrityRemediationRepairDecisionResult,
  ResearchLineageIntegrityRemediationRepairExecutionResult,
  ResearchLineageIntegrityRemediationTargetValidation,
  ResearchLineageIntegrityResolvedRemediationTarget,
  ResearchLineageIntegrityActionTarget,
} from "@/types/research";

export interface ResearchLineageRemediationExecutionDependencies {
  getResearchLineageIntegrityRemediationExecutionPolicy(
    action: ResearchLineageIntegrityRemediationRequest["action"],
  ): ResearchLineageIntegrityRemediationExecutionPolicy;

  validateResearchLineageIntegrityRemediationTarget(
    investigationId: string,
    target: ResearchLineageIntegrityActionTarget,
    action?: ResearchLineageIntegrityRemediationPlan["action"],
  ): ResearchLineageIntegrityRemediationTargetValidation;

  resolveResearchLineageIntegrityRemediationTarget(
    investigationId: string,
    target: ResearchLineageIntegrityActionTarget,
    action?: ResearchLineageIntegrityRemediationPlan["action"],
  ): ResearchLineageIntegrityResolvedRemediationTarget;

  getResearchLineageRemediationEntityUpdatedAt(
    target: ResearchLineageIntegrityResolvedRemediationTarget,
  ): string | undefined;

  getResearchLineageRemediationReplacement(
    investigationId: string,
    replacementEntityId: string | undefined,
  ): ResearchFinding | undefined;

  decideResearchLineageIntegrityRemediationRepair(
    plan: ResearchLineageIntegrityRemediationPlan,
  ): ResearchLineageIntegrityRemediationRepairDecisionResult;

  executeResearchLineageIntegrityRemediationRepair(
    decision: ResearchLineageIntegrityRemediationRepairDecisionResult,
  ): ResearchLineageIntegrityRemediationRepairExecutionResult;
}

export function preflightResearchLineageIntegrityRemediation(
  plan: ResearchLineageIntegrityRemediationPlan,
  dependencies: ResearchLineageRemediationExecutionDependencies,
): ResearchLineageIntegrityRemediationExecutionPreflight {
  const policy =
    dependencies.getResearchLineageIntegrityRemediationExecutionPolicy(
      plan.action,
    );

  const targetValidation =
    dependencies.validateResearchLineageIntegrityRemediationTarget(
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
    reason:
      "Remediation passed confirmation, execution-policy, and target-validation checks.",
  };
}

export function executeResearchLineageIntegrityRemediation(
  plan: ResearchLineageIntegrityRemediationPlan,
  dependencies: ResearchLineageRemediationExecutionDependencies,
): ResearchLineageIntegrityRemediationResult {
  if (!plan.confirmed) {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      status: "Rejected",
      executed: false,
      message: "Remediation execution requires explicit confirmation.",
      plan,
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
      status: "Rejected",
      executed: false,
      message: `Remediation action ${plan.action} is not executable.`,
      plan,
    };
  }

  const preflight = preflightResearchLineageIntegrityRemediation(
    plan,
    dependencies,
  );

  if (!preflight.ready) {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      status: "Rejected",
      executed: false,
      message: preflight.reason,
      plan,
    };
  }

  const resolvedTarget =
    dependencies.resolveResearchLineageIntegrityRemediationTarget(
      plan.investigationId,
      plan.target,
      plan.action,
    );

  if (!resolvedTarget.resolvable) {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      status: "Rejected",
      executed: false,
      message: `Execution target could not be resolved: ${resolvedTarget.reason}`,
      plan,
    };
  }

  if (plan.targetUpdatedAt) {
    const currentTargetUpdatedAt =
      dependencies.getResearchLineageRemediationEntityUpdatedAt(
        resolvedTarget,
      );

    if (currentTargetUpdatedAt !== plan.targetUpdatedAt) {
      return {
        investigationId: plan.investigationId,
        action: plan.action,
        issueCode: plan.issueCode,
        status: "Rejected",
        executed: false,
        message:
          "Remediation execution rejected because the target changed after the remediation plan was created.",
        plan,
      };
    }
  }

  if (
    plan.replacementUpdatedAt !== undefined &&
    plan.replacementEntityId
  ) {
    const currentReplacement =
      dependencies.getResearchLineageRemediationReplacement(
        plan.investigationId,
        plan.replacementEntityId,
      );

    const currentReplacementUpdatedAt =
      currentReplacement?.updatedAt;

    if (
      currentReplacementUpdatedAt !==
      plan.replacementUpdatedAt
    ) {
      return {
        investigationId: plan.investigationId,
        action: plan.action,
        issueCode: plan.issueCode,
        status: "Rejected",
        executed: false,
        message:
          "Remediation execution rejected because the replacement changed after the remediation plan was created.",
        plan,
      };
    }
  }

  const repairDecision =
    dependencies.decideResearchLineageIntegrityRemediationRepair(
      plan,
    );

  const repairResult =
    dependencies.executeResearchLineageIntegrityRemediationRepair(
      repairDecision,
    );

  return {
    investigationId: plan.investigationId,
    action: plan.action,
    issueCode: plan.issueCode,
    status: repairResult.executed ? "Executed" : "Rejected",
    executed: repairResult.executed,
    message: repairResult.message,
    provenanceEventId: repairResult.provenanceEventId,
    postcondition: repairResult.postcondition,
    plan,
  };
}
