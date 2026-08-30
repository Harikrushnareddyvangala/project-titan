import type {
  ResearchLineageIntegrityAssessment,
  ResearchLineageIntegrityAssessmentExplanation,
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityIssueExplanation,
  ResearchLineageIntegrityPriority,
  ResearchLineageIntegrityPrioritySummary,
  ResearchLineageIntegrityCategory,
} from "@/types/research";

export function getResearchLineageIntegrityCategory(
  code: string,
): ResearchLineageIntegrityCategory {
  if (code === "INVESTIGATION_NOT_FOUND") {
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

  if (code === "CROSS_INVESTIGATION_EDGE") {
    return "Scope";
  }

  if (code === "CONCLUSION_FINDING_REFERENCE_INVALID") {
    return "Reference";
  }

  if (code.startsWith("PROVENANCE_")) {
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
    code === "CONCLUSION_FINDING_REFERENCE_INVALID"
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

  if (code.startsWith("PROVENANCE_")) {
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
    const priority = getResearchLineageIntegrityPriority(issue.code);

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

export function getResearchLineageIntegrityAssessment(
  summary: ResearchLineageIntegrityPrioritySummary,
): ResearchLineageIntegrityAssessment {
  if (summary.critical > 0) {
    return "Critical";
  }

  if (summary.high > 0) {
    return "Degraded";
  }

  if (summary.medium > 0) {
    return "Attention";
  }

  return "Healthy";
}

export function getResearchLineageIntegrityAssessmentExplanation(
  summary: ResearchLineageIntegrityPrioritySummary,
): ResearchLineageIntegrityAssessmentExplanation {
  const assessment = getResearchLineageIntegrityAssessment(summary);

  switch (assessment) {
    case "Critical":
      return {
        assessment,
        title: "Critical integrity risk",
        description:
          "Critical lineage integrity findings indicate that the investigation graph cannot currently be treated as trustworthy.",
        recommendation:
          "Resolve critical lineage integrity findings before relying on the investigation conclusion.",
      };

    case "Degraded":
      return {
        assessment,
        title: "Degraded integrity",
        description:
          "High-priority lineage integrity findings require investigation before the lineage can be considered fully reliable.",
        recommendation:
          "Investigate and resolve high-priority lineage integrity findings.",
      };

    case "Attention":
      return {
        assessment,
        title: "Integrity requires attention",
        description:
          "Medium-priority lineage integrity findings are present and may affect the reliability or completeness of the research graph.",
        recommendation:
          "Review the medium-priority findings and resolve them where appropriate.",
      };

    case "Healthy":
      return {
        assessment,
        title: "Healthy lineage integrity",
        description:
          "No critical, high, or medium-priority lineage integrity findings are currently present.",
        recommendation:
          "Continue monitoring lineage integrity as the investigation evolves.",
      };
  }
}

export function getResearchLineageIntegrityIssueExplanation(
  code: string,
): ResearchLineageIntegrityIssueExplanation {
  switch (code) {
    case "INVESTIGATION_NOT_FOUND":
      return {
        title: "Investigation reference is missing",
        description:
          "The integrity event references an investigation that cannot be resolved.",
        recommendation:
          "Verify the investigation identifier and restore the missing investigation reference before relying on this lineage.",
      };

    case "NODE_INVESTIGATION_MISMATCH":
      return {
        title: "Node belongs to another investigation",
        description:
          "The lineage node is associated with a different investigation scope.",
        recommendation:
          "Verify the node's investigation ownership and correct the lineage scope.",
      };

    case "INVALID_NODE":
      return {
        title: "Lineage node is invalid",
        description:
          "The underlying research record required by this lineage node is incomplete or invalid.",
        recommendation:
          "Inspect the node's missing links and repair the underlying research record.",
      };

    case "NODE_ISSUES_PRESENT":
      return {
        title: "Node has unresolved integrity issues",
        description:
          "The lineage node contains one or more unresolved research integrity problems.",
        recommendation:
          "Inspect the node's associated issues and resolve the underlying research records.",
      };

    case "DUPLICATE_EDGE":
      return {
        title: "Duplicate lineage edge",
        description:
          "More than one equivalent edge exists between the same lineage records.",
        recommendation:
          "Inspect the duplicate edges and retain only the intended relationship.",
      };

    case "SOURCE_NODE_NOT_FOUND":
      return {
        title: "Source node is missing",
        description:
          "The lineage edge references a source node that cannot be resolved.",
        recommendation:
          "Restore the source node or remove the invalid edge reference.",
      };

    case "TARGET_NODE_NOT_FOUND":
      return {
        title: "Target node is missing",
        description:
          "The lineage edge references a target node that cannot be resolved.",
        recommendation:
          "Restore the target node or remove the invalid edge reference.",
      };

    case "INVALID_EDGE_DIRECTION":
      return {
        title: "Invalid edge direction",
        description:
          "The relationship between the source and target lineage nodes is not permitted.",
        recommendation:
          "Verify the relationship semantics and correct the edge direction or type.",
      };

    case "SELF_REFERENTIAL_EDGE":
      return {
        title: "Self-referential lineage edge",
        description:
          "A lineage edge points from a node back to itself.",
        recommendation:
          "Verify whether the relationship is meaningful and remove the self-reference if it is invalid.",
      };

    case "CROSS_INVESTIGATION_EDGE":
      return {
        title: "Cross-investigation relationship",
        description:
          "A lineage edge connects records belonging to different investigations.",
        recommendation:
          "Verify the intended investigation scope and separate or explicitly reconcile the cross-investigation relationship.",
      };

    case "CONCLUSION_FINDING_REFERENCE_INVALID":
      return {
        title: "Conclusion references an invalid finding",
        description:
          "A conclusion contains a finding reference that cannot be validated against the investigation lineage.",
        recommendation:
          "Verify the finding reference and update the conclusion or finding lineage before relying on the conclusion.",
      };

    default:
      if (code.startsWith("PROVENANCE_")) {
        return {
          title: "Provenance integrity issue",
          description:
            "A provenance-related integrity problem was detected.",
          recommendation:
            "Inspect the associated provenance event and repair the underlying lineage or provenance record.",
        };
      }

      return {
        title: "Research lineage integrity issue",
        description:
          "An integrity problem was detected in the research lineage.",
        recommendation:
          "Inspect the associated lineage records and resolve the underlying reference or relationship.",
      };
  }
}