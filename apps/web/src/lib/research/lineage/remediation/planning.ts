import type {
  ResearchEvidence,
  ResearchExperiment,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchLineage,
  ResearchLineageIntegrityActionTarget,
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityIssueAction,
  ResearchLineageIntegrityRemediationExecutionPolicy,
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRequest,
  ResearchLineageIntegrityRemediationTargetValidation,
  ResearchLineageIntegrityResolvedRemediationTarget,
} from "@/types/research";

export interface ResearchLineageRemediationPlanningDependencies {
  getResearchLineage(investigationId: string): ResearchLineage;

  getResearchInvestigations(): ResearchInvestigation[];
  getResearchExperiments(): ResearchExperiment[];
  getResearchEvidence(): ResearchEvidence[];
  getResearchFindings(): ResearchFinding[];
  getResearchFindingValidations(): ResearchFindingValidation[];
  getResearchInvestigationConclusions(): ResearchInvestigationConclusion[];
}

export function getResearchLineageIntegrityIssueAction(
  issue: ResearchLineageIntegrityIssue,
): ResearchLineageIntegrityIssueAction {
  const code = issue.code;

  const target: ResearchLineageIntegrityActionTarget = {
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
  dependencies: ResearchLineageRemediationPlanningDependencies,
): string | undefined {
  if (!target.resolvable || !target.entityId) {
    return undefined;
  }

  switch (target.kind) {
    case "Investigation":
      return dependencies.getResearchInvestigations().find(
        (item) => item.id === target.entityId,
      )?.updatedAt;

    case "Experiment":
      return dependencies.getResearchExperiments().find(
        (item) => item.id === target.entityId,
      )?.updatedAt;

    case "Finding":
      return dependencies.getResearchFindings().find(
        (item) => item.id === target.entityId,
      )?.updatedAt;

    case "FindingValidation":
      return dependencies.getResearchFindingValidations().find(
        (item) => item.id === target.entityId,
      )?.updatedAt;

    case "Conclusion":
      return dependencies.getResearchInvestigationConclusions().find(
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
  dependencies: ResearchLineageRemediationPlanningDependencies,
): ResearchFinding | undefined {
  if (!replacementEntityId) {
    return undefined;
  }

  const investigation = dependencies.getResearchInvestigations().find(
    (item) => item.id === investigationId,
  );

  if (!investigation || !investigation.findingIds.includes(replacementEntityId)) {
    return undefined;
  }

  return dependencies.getResearchFindings().find(
    (finding) => finding.id === replacementEntityId,
  );
}

export function createResearchLineageIntegrityRemediationPlan(
  request: ResearchLineageIntegrityRemediationRequest,
  dependencies: ResearchLineageRemediationPlanningDependencies,
): ResearchLineageIntegrityRemediationPlan {
  const resolvedTarget = resolveResearchLineageIntegrityRemediationTarget(
    request.investigationId,
    request.target,
    request.action,
    dependencies,
  );

  const targetUpdatedAt = getResearchLineageRemediationEntityUpdatedAt(
    resolvedTarget,
    dependencies,
  );

  const replacementUpdatedAt = request.replacementEntityId
    ? getResearchLineageRemediationReplacement(
        request.investigationId,
        request.replacementEntityId,
        dependencies,
      )?.updatedAt
    : undefined;

  return {
    investigationId: request.investigationId,
    action: request.action,
    issueCode: request.issueCode,
    target: request.target,
    replacementEntityId: request.replacementEntityId,
    confirmed: request.confirmed,
    status: request.confirmed ? "Validated" : "Planned",
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
  action: ResearchLineageIntegrityRemediationPlan["action"] | undefined,
  dependencies: ResearchLineageRemediationPlanningDependencies,
): ResearchLineageIntegrityRemediationTargetValidation {
  const lineage = dependencies.getResearchLineage(investigationId);

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
  action: ResearchLineageIntegrityRemediationPlan["action"] | undefined,
  dependencies: ResearchLineageRemediationPlanningDependencies,
): ResearchLineageIntegrityResolvedRemediationTarget {
  const lineage = dependencies.getResearchLineage(investigationId);

  if (lineage.investigationId !== investigationId) {
    return {
      investigationId,
      kind: "Relationship",
      resolvable: false,
      reason: "The remediation target does not belong to the requested investigation.",
    };
  }

  if (action === "RepairReference" && target.targetId) {
    const targetNode = lineage.nodes.find((node) => node.id === target.targetId);

    if (!targetNode) {
      return {
        investigationId,
        kind: "Relationship",
        entityId: target.targetId,
        resolvable: false,
        reason:
          "The owning remediation target could not be resolved in the investigation lineage.",
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
      reason:
        "The remediation relationship was resolved from the investigation lineage.",
    };
  }

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
      reason:
        "The requested remediation node could not be resolved in the investigation lineage.",
    };
  }

  switch (node.type) {
    case "Investigation": {
      const exists = dependencies.getResearchInvestigations().some(
        (item) => item.id === node.id,
      );

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
      const exists = dependencies.getResearchExperiments().some(
        (item) => item.id === node.id,
      );

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
      const exists = dependencies.getResearchEvidence().some(
        (item) => item.id === node.id,
      );

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
      const exists = dependencies.getResearchFindings().some(
        (item) => item.id === node.id,
      );

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
      const exists = dependencies.getResearchFindingValidations().some(
        (item) => item.id === node.id,
      );

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
      const exists = dependencies.getResearchInvestigationConclusions().some(
        (item) => item.id === node.id,
      );

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

    default:
      return {
        investigationId,
        kind: "Relationship",
        entityId: node.id,
        resolvable: false,
        reason: "The remediation target uses an unsupported lineage node type.",
      };
  }
}

export function createResearchLineageRemediationPlanningService(
  dependencies: ResearchLineageRemediationPlanningDependencies,
) {
  return {
    getResearchLineageIntegrityIssueAction: (
      issue: ResearchLineageIntegrityIssue,
    ): ResearchLineageIntegrityIssueAction =>
      getResearchLineageIntegrityIssueAction(issue),

    createResearchLineageIntegrityRemediationRequest: (
      investigationId: string,
      issue: ResearchLineageIntegrityIssue,
      confirmed: boolean,
      replacementEntityId?: string,
    ): ResearchLineageIntegrityRemediationRequest | null =>
      createResearchLineageIntegrityRemediationRequest(
        investigationId,
        issue,
        confirmed,
        replacementEntityId,
      ),

    getResearchLineageRemediationReplacement: (
      investigationId: string,
      replacementEntityId: string | undefined,
    ): ResearchFinding | undefined =>
      getResearchLineageRemediationReplacement(
        investigationId,
        replacementEntityId,
        dependencies,
      ),

    createResearchLineageIntegrityRemediationPlan: (
      request: ResearchLineageIntegrityRemediationRequest,
    ): ResearchLineageIntegrityRemediationPlan =>
      createResearchLineageIntegrityRemediationPlan(
        request,
        dependencies,
      ),

    getResearchLineageIntegrityRemediationExecutionPolicy: (
      action: ResearchLineageIntegrityRemediationRequest["action"],
    ): ResearchLineageIntegrityRemediationExecutionPolicy =>
      getResearchLineageIntegrityRemediationExecutionPolicy(action),

    validateResearchLineageIntegrityRemediationTarget: (
      investigationId: string,
      target: ResearchLineageIntegrityActionTarget,
      action?: ResearchLineageIntegrityRemediationPlan["action"],
    ): ResearchLineageIntegrityRemediationTargetValidation =>
      validateResearchLineageIntegrityRemediationTarget(
        investigationId,
        target,
        action,
        dependencies,
      ),

    resolveResearchLineageIntegrityRemediationTarget: (
      investigationId: string,
      target: ResearchLineageIntegrityActionTarget,
      action?: ResearchLineageIntegrityRemediationPlan["action"],
    ): ResearchLineageIntegrityResolvedRemediationTarget =>
      resolveResearchLineageIntegrityRemediationTarget(
        investigationId,
        target,
        action,
        dependencies,
      ),

    getResearchLineageRemediationEntityUpdatedAt: (
      target: ResearchLineageIntegrityResolvedRemediationTarget,
    ): string | undefined =>
      getResearchLineageRemediationEntityUpdatedAt(
        target,
        dependencies,
      ),
  };
}
