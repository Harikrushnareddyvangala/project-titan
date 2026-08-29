import type {
  ResearchLineage,
  ResearchLineageEdgeType,
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityResult,
  ResearchLineageNodeType,
  ResearchProvenanceIntegrityResult,
} from "@/types/research";

export interface ResearchLineageIntegrityDependencies {
  getResearchLineage(
    investigationId: string,
  ): ResearchLineage;

  validateResearchProvenanceIntegrity(): ResearchProvenanceIntegrityResult;
}

export function validateResearchLineage(
  investigationId: string,
  dependencies: ResearchLineageIntegrityDependencies,
): ResearchLineageIntegrityResult {
  const lineage = dependencies.getResearchLineage(investigationId);

  const issues: ResearchLineageIntegrityIssue[] = [];

  const addIssue = (
    issue: ResearchLineageIntegrityIssue,
  ): void => {
    issues.push(issue);
  };

  if (lineage.nodes.length === 0) {
    addIssue({
      investigationId,
      code: "INVESTIGATION_NOT_FOUND",
      message: `Investigation ${investigationId} has no lineage graph.`,
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

  const nodeById = new Map(
    lineage.nodes.map((node) => [node.id, node]),
  );

  const edgeIds = new Set<string>();

  const validEdgeTypes: Record<
    ResearchLineageEdgeType,
    Array<[ResearchLineageNodeType, ResearchLineageNodeType]>
  > = {
    Contains: [["Investigation", "Experiment"]],

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
    if (node.investigationId !== investigationId) {
      addIssue({
        investigationId,
        code: "NODE_INVESTIGATION_MISMATCH",
        message:
          `Node ${node.id} belongs to investigation ` +
          `${node.investigationId}, not ${investigationId}.`,
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

    if (node.issueCount !== 0) {
      addIssue({
        investigationId,
        code: "NODE_ISSUES_PRESENT",
        message:
          `Lineage node ${node.id} reports ` +
          `${node.issueCount} issue(s).`,
        nodeId: node.id,
      });
    }
  }

  for (const edge of lineage.edges) {
    if (edgeIds.has(edge.id)) {
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

    const source = nodeById.get(edge.sourceId);
    const target = nodeById.get(edge.targetId);

    if (!source) {
      addIssue({
        investigationId,
        code: "SOURCE_NODE_NOT_FOUND",
        message:
          `Lineage edge ${edge.id} references missing ` +
          `source node ${edge.sourceId}.`,
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
          `Lineage edge ${edge.id} references missing ` +
          `target node ${edge.targetId}.`,
        edgeId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      });
    }

    if (!source || !target) {
      continue;
    }

    if (
      source.investigationId !== investigationId ||
      target.investigationId !== investigationId
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

    const allowedPairs = validEdgeTypes[edge.type];

    const validPair =
      allowedPairs?.some(
        ([sourceType, targetType]) =>
          source.type === sourceType &&
          target.type === targetType,
      ) ?? false;

    if (!validPair) {
      addIssue({
        investigationId,
        code: "INVALID_EDGE_DIRECTION",
        message:
          `Edge ${edge.id} has invalid relationship ` +
          `${edge.type}: ${source.type} → ${target.type}.`,
        edgeId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      });
    }

    if (edge.sourceId === edge.targetId) {
      addIssue({
        investigationId,
        code: "SELF_REFERENTIAL_EDGE",
        message:
          `Lineage edge ${edge.id} connects node ` +
          `${edge.sourceId} to itself.`,
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

    const target = nodeById.get(edge.targetId);

    if (target?.type !== "Conclusion") {
      continue;
    }

    const source = nodeById.get(edge.sourceId);

    if (source?.type !== "Finding") {
      addIssue({
        investigationId,
        code: "CONCLUSION_FINDING_REFERENCE_INVALID",
        message:
          `Conclusion ${edge.targetId} references ` +
          `${edge.sourceId}, which is not a Finding node.`,
        edgeId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      });
    }
  }

  const provenanceResult =
    dependencies.validateResearchProvenanceIntegrity();

  const provenanceIssues =
    provenanceResult.issues.filter(
      (issue) =>
        issue.investigationId === investigationId,
    );

  for (const issue of provenanceIssues) {
    addIssue({
      investigationId,
      code: `PROVENANCE_${issue.code}`,
      message:
        `Underlying provenance issue ${issue.code}: ` +
        `${issue.message}`,
      provenanceEventId: issue.eventId,
    });
  }

  return {
    investigationId,
    valid: issues.length === 0,
    checkedNodeCount: lineage.nodes.length,
    checkedEdgeCount: lineage.edges.length,
    issueCount: issues.length,
    issues,
  };
}

export function validateResearchLineageForInvestigation(
  investigationId: string,
  dependencies: ResearchLineageIntegrityDependencies,
): ResearchLineageIntegrityResult {
  return validateResearchLineage(
    investigationId,
    dependencies,
  );
}
