import type {
  ResearchFinding,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchLineageIntegrityRemediationMutationContract,
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationPostcondition,
  ResearchLineageIntegrityRemediationRepairDecisionResult,
  ResearchLineageIntegrityRemediationReplacementCandidate,
  ResearchLineageIntegrityRemediationReplacementDiscoveryResult,
  ResearchLineageIntegrityRemediationRepairExecutionResult,
  ResearchLineageIntegrityResolvedRemediationTarget,
  ResearchLineageIntegrityResult,
} from "@/types/research";

export interface ResearchLineageRemediationRepairDependencies {
  getResearchInvestigations(): ResearchInvestigation[];
  getResearchFindings(): ResearchFinding[];
  getResearchInvestigationConclusions(): ResearchInvestigationConclusion[];

  resolveResearchLineageIntegrityRemediationTarget(
    investigationId: string,
    target: ResearchLineageIntegrityRemediationPlan["target"],
    action?: ResearchLineageIntegrityRemediationPlan["action"],
  ): ResearchLineageIntegrityResolvedRemediationTarget;

  saveResearchInvestigationConclusion(
    conclusion: ResearchInvestigationConclusion,
  ): void;

  createResearchProvenanceEvent(input: {
    investigationId: string;
    entityType: "Conclusion";
    entityId: string;
    eventType: "Updated";
    reason: string;
  }): {
    id: string;
  };

  validateResearchLineage(
    investigationId: string,
  ): ResearchLineageIntegrityResult;
}

export function discoverResearchLineageIntegrityRemediationReplacement(
  plan: ResearchLineageIntegrityRemediationPlan,
  dependencies: ResearchLineageRemediationRepairDependencies,
): ResearchLineageIntegrityRemediationReplacementDiscoveryResult {
  const investigation = dependencies
    .getResearchInvestigations()
    .find((item) => item.id === plan.investigationId);

  if (!investigation) {
    return {
      investigationId: plan.investigationId,
      issueCode: plan.issueCode,
      status: "NotFound",
      candidates: [],
      selectedCandidate: null,
      reason:
        "The investigation does not exist, so no canonical replacement can be discovered.",
    };
  }

  if (plan.issueCode !== "CONCLUSION_FINDING_REFERENCE_INVALID") {
    return {
      investigationId: plan.investigationId,
      issueCode: plan.issueCode,
      status: "NotFound",
      candidates: [],
      selectedCandidate: null,
      reason:
        "No canonical replacement-discovery rule is defined for this issue.",
    };
  }

  if (!plan.replacementEntityId) {
    const candidates = dependencies
      .getResearchFindings()
      .filter((finding) =>
        investigation.findingIds.includes(finding.id),
      )
      .map(
        (
          finding,
        ): ResearchLineageIntegrityRemediationReplacementCandidate => ({
          id: finding.id,
          title: finding.statement,
          investigationId: plan.investigationId,
          reason:
            "The finding belongs to the investigation and is eligible for replacement discovery.",
        }),
      );

    if (candidates.length === 0) {
      return {
        investigationId: plan.investigationId,
        issueCode: plan.issueCode,
        status: "NotFound",
        candidates: [],
        selectedCandidate: null,
        reason:
          "No candidate replacement finding could be discovered within the investigation.",
      };
    }

    if (candidates.length > 1) {
      return {
        investigationId: plan.investigationId,
        issueCode: plan.issueCode,
        status: "Ambiguous",
        candidates,
        selectedCandidate: null,
        reason:
          "Multiple candidate replacement findings were discovered within the investigation, so no deterministic replacement can be selected.",
      };
    }

    return {
      investigationId: plan.investigationId,
      issueCode: plan.issueCode,
      status: "Resolved",
      candidates,
      selectedCandidate: candidates[0],
      reason:
        "Exactly one candidate replacement finding was discovered within the investigation.",
    };
  }

  const finding = dependencies.getResearchFindings().find(
    (item) =>
      item.id === plan.replacementEntityId &&
      investigation.findingIds.includes(item.id),
  );

  if (!finding) {
    return {
      investigationId: plan.investigationId,
      issueCode: plan.issueCode,
      status: "NotFound",
      candidates: [],
      selectedCandidate: null,
      reason: `The explicit replacement finding ${plan.replacementEntityId} could not be resolved within the investigation.`,
    };
  }

  const candidate: ResearchLineageIntegrityRemediationReplacementCandidate =
    {
      id: finding.id,
      title: finding.statement,
      investigationId: plan.investigationId,
      reason:
        "The replacement finding was explicitly identified and resolved by exact ID within the investigation.",
    };

  return {
    investigationId: plan.investigationId,
    issueCode: plan.issueCode,
    status: "Resolved",
    candidates: [candidate],
    selectedCandidate: candidate,
    reason:
      "The explicit replacement finding resolved uniquely within the investigation.",
  };
}

export function decideResearchLineageIntegrityRemediationRepair(
  plan: ResearchLineageIntegrityRemediationPlan,
  dependencies: ResearchLineageRemediationRepairDependencies,
): ResearchLineageIntegrityRemediationRepairDecisionResult {
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
      decision: "NotRepairable",
      resolvedTarget,
      repairDescription: "No deterministic repair will be performed.",
      reason: resolvedTarget.reason,
    };
  }

  if (plan.action !== "RepairReference") {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      decision: "NotRepairable",
      resolvedTarget,
      repairDescription:
        "The current repair decision contract only permits deterministic reference repairs.",
      reason: `Remediation action ${plan.action} does not have a deterministic reference-repair mutation defined.`,
    };
  }

  const replacementDiscovery =
    discoverResearchLineageIntegrityRemediationReplacement(
      plan,
      dependencies,
    );

  if (replacementDiscovery.status === "NotFound") {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      decision: "NotRepairable",
      resolvedTarget,
      repairDescription: "No deterministic replacement was discovered.",
      reason: replacementDiscovery.reason,
    };
  }

  if (replacementDiscovery.status === "Ambiguous") {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      decision: "NotRepairable",
      resolvedTarget,
      repairDescription:
        "Multiple possible replacements were discovered, so no automatic repair will be selected.",
      reason: replacementDiscovery.reason,
    };
  }

  const candidate = replacementDiscovery.selectedCandidate;

  if (
    !candidate ||
    replacementDiscovery.candidates.length !== 1 ||
    candidate.investigationId !== plan.investigationId
  ) {
    return {
      investigationId: plan.investigationId,
      action: plan.action,
      issueCode: plan.issueCode,
      decision: "NotRepairable",
      resolvedTarget,
      repairDescription:
        "The discovered replacement does not satisfy the deterministic repair contract.",
      reason:
        "A repair candidate must be uniquely selected and belong to the same investigation.",
    };
  }

  return {
    investigationId: plan.investigationId,
    action: plan.action,
    issueCode: plan.issueCode,
    decision: "Repairable",
    resolvedTarget,
    replacementEntityId: candidate.id,
    repairDescription: `A deterministic replacement candidate ${candidate.id} was uniquely discovered for this remediation.`,
    reason:
      "The remediation target resolves successfully and replacement discovery produced exactly one candidate within the investigation.",
  };
}

export function createResearchLineageIntegrityRemediationMutationContract(
  decision: ResearchLineageIntegrityRemediationRepairDecisionResult,
): ResearchLineageIntegrityRemediationMutationContract | null {
  if (decision.decision !== "Repairable") {
    return null;
  }

  if (decision.action !== "RepairReference") {
    return null;
  }

  if (!decision.replacementEntityId) {
    return null;
  }

  return {
    mutationType: "ReferenceReplacement",
    investigationId: decision.investigationId,
    action: decision.action,
    issueCode: decision.issueCode,
    target: decision.resolvedTarget,
    replacementEntityId: decision.replacementEntityId,
    deterministic: true,
    requiresConfirmation: true,
    createsProvenanceEvent: true,
    description:
      "Apply only the deterministic reference replacement defined by the repair decision.",
  };
}

export function executeResearchLineageIntegrityRemediationRepair(
  decision: ResearchLineageIntegrityRemediationRepairDecisionResult,
  dependencies: ResearchLineageRemediationRepairDependencies,
): ResearchLineageIntegrityRemediationRepairExecutionResult {
  if (decision.decision !== "Repairable") {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: null,
      message:
        "Repair execution rejected because the repair decision is not deterministic.",
    };
  }

  const mutationContract =
    createResearchLineageIntegrityRemediationMutationContract(
      decision,
    );

  if (!mutationContract) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: null,
      message:
        "Repair execution rejected because no valid mutation contract exists.",
    };
  }

  if (!mutationContract.deterministic) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: null,
      message:
        "Repair execution rejected because the mutation is not deterministic.",
    };
  }

  if (mutationContract.mutationType !== "ReferenceReplacement") {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: null,
      message:
        "Repair execution rejected because the mutation type is unsupported.",
    };
  }

  const conclusionId = mutationContract.target.entityId;

  if (!conclusionId) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: mutationContract.mutationType,
      message:
        "Repair execution rejected because the target conclusion could not be resolved.",
    };
  }

  const replacementFindingId = mutationContract.replacementEntityId;

  if (!replacementFindingId) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: mutationContract.mutationType,
      message:
        "Repair execution rejected because the repair decision does not contain a replacement entity ID.",
    };
  }

  const conclusion = dependencies
    .getResearchInvestigationConclusions()
    .find(
      (item) =>
        item.id === conclusionId &&
        item.investigationId === decision.investigationId,
    );

  if (!conclusion) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: mutationContract.mutationType,
      message:
        "Repair execution rejected because the target conclusion could not be found within the investigation.",
    };
  }

  const finding = dependencies
    .getResearchFindings()
    .find((item) => item.id === replacementFindingId);

  if (!finding) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: mutationContract.mutationType,
      message:
        "Repair execution rejected because the replacement finding could not be found.",
    };
  }

  const investigation = dependencies
    .getResearchInvestigations()
    .find((item) => item.id === decision.investigationId);

  if (
    !investigation ||
    !investigation.findingIds.includes(replacementFindingId)
  ) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: mutationContract.mutationType,
      message:
        "Repair execution rejected because the replacement finding does not belong to the investigation.",
    };
  }

  const hasSupportingReference =
    conclusion.supportingFindingIds.includes(
      replacementFindingId,
    );

  const hasContradictingReference =
    conclusion.contradictingFindingIds.includes(
      replacementFindingId,
    );

  if (hasSupportingReference || hasContradictingReference) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: mutationContract.mutationType,
      message:
        "Repair execution rejected because the replacement finding is already referenced by the conclusion.",
    };
  }

  const sourceId = mutationContract.target.sourceId;

  if (!sourceId) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: mutationContract.mutationType,
      message:
        "Repair execution rejected because the invalid source reference could not be resolved.",
    };
  }

  const replacesSupportingReference =
    conclusion.supportingFindingIds.includes(sourceId);

  const replacesContradictingReference =
    conclusion.contradictingFindingIds.includes(sourceId);

  if (
    !replacesSupportingReference &&
    !replacesContradictingReference
  ) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: mutationContract.mutationType,
      message:
        "Repair execution rejected because the invalid finding reference is not present on the target conclusion.",
    };
  }

  const updatedConclusion: ResearchInvestigationConclusion = {
    ...conclusion,

    supportingFindingIds: replacesSupportingReference
      ? conclusion.supportingFindingIds.map((findingId) =>
          findingId === sourceId
            ? replacementFindingId
            : findingId,
        )
      : conclusion.supportingFindingIds,

    contradictingFindingIds: replacesContradictingReference
      ? conclusion.contradictingFindingIds.map((findingId) =>
          findingId === sourceId
            ? replacementFindingId
            : findingId,
        )
      : conclusion.contradictingFindingIds,

    updatedAt: new Date().toISOString(),
  };

  dependencies.saveResearchInvestigationConclusion(
    updatedConclusion,
  );

  const provenanceEvent =
    dependencies.createResearchProvenanceEvent({
      investigationId: decision.investigationId,
      entityType: "Conclusion",
      entityId: conclusion.id,
      eventType: "Updated",
      reason: `Deterministic remediation replaced invalid finding reference ${sourceId} with ${replacementFindingId}.`,
    });

  const validation = dependencies.validateResearchLineage(
    decision.investigationId,
  );

  const postcondition: ResearchLineageIntegrityRemediationPostcondition =
    {
      validated: true,
      valid: validation.valid,
      issueCount: validation.issueCount,
      issues: validation.issues,
      checkedNodeCount: validation.checkedNodeCount,
      checkedEdgeCount: validation.checkedEdgeCount,
    };

  if (
    validation.issues.some(
      (issue) =>
        issue.code === "CONCLUSION_FINDING_REFERENCE_INVALID" &&
        issue.targetId === conclusion.id,
    )
  ) {
    return {
      investigationId: decision.investigationId,
      action: decision.action,
      issueCode: decision.issueCode,
      executed: false,
      mutationType: mutationContract.mutationType,
      provenanceEventId: provenanceEvent.id,
      postcondition,
      message:
        "The reference mutation was persisted, but lineage validation still reports an invalid conclusion finding reference.",
    };
  }

  return {
    investigationId: decision.investigationId,
    action: decision.action,
    issueCode: decision.issueCode,
    executed: true,
    mutationType: mutationContract.mutationType,
    provenanceEventId: provenanceEvent.id,
    postcondition,
    message: `Deterministic reference repair completed: ${sourceId} was replaced with ${replacementFindingId} on conclusion ${conclusion.id}.`,
  };
}

export function createResearchLineageRemediationRepairService(
  dependencies: ResearchLineageRemediationRepairDependencies,
) {
  return {
    discoverResearchLineageIntegrityRemediationReplacement: (
      plan: ResearchLineageIntegrityRemediationPlan,
    ): ResearchLineageIntegrityRemediationReplacementDiscoveryResult =>
      discoverResearchLineageIntegrityRemediationReplacement(
        plan,
        dependencies,
      ),

    decideResearchLineageIntegrityRemediationRepair: (
      plan: ResearchLineageIntegrityRemediationPlan,
    ): ResearchLineageIntegrityRemediationRepairDecisionResult =>
      decideResearchLineageIntegrityRemediationRepair(
        plan,
        dependencies,
      ),

    createResearchLineageIntegrityRemediationMutationContract: (
      decision: ResearchLineageIntegrityRemediationRepairDecisionResult,
    ): ResearchLineageIntegrityRemediationMutationContract | null =>
      createResearchLineageIntegrityRemediationMutationContract(
        decision,
      ),

    executeResearchLineageIntegrityRemediationRepair: (
      decision: ResearchLineageIntegrityRemediationRepairDecisionResult,
    ): ResearchLineageIntegrityRemediationRepairExecutionResult =>
      executeResearchLineageIntegrityRemediationRepair(
        decision,
        dependencies,
      ),
  };
}
