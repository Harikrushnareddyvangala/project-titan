import type {
  ResearchEvidence,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchLineage,
  ResearchLineageEdge,
  ResearchLineageEdgeType,
  ResearchLineageNode,
  ResearchLineageNodeType,
  ResearchProvenanceEvent,
  ResearchProvenanceIntegrityResult,
} from "@/types/research";

export interface ResearchLineageGraphDependencies {
  getResearchInvestigations(): ResearchInvestigation[];
  getResearchExperiments(): Array<{
    id: string;
    title: string;
    objective: string;
    status: ResearchInvestigation["status"];
    investigationId: string;
    evidenceIds: string[];
    findingIds: string[];
  }>;
  getResearchEvidence(): ResearchEvidence[];
  getResearchFindings(): ResearchFinding[];
  getResearchFindingValidations(): ResearchFindingValidation[];
  getResearchInvestigationConclusions(): ResearchInvestigationConclusion[];
  getResearchProvenanceEventsByInvestigation(
    investigationId: string,
  ): ResearchProvenanceEvent[];
  validateResearchProvenanceIntegrity(): ResearchProvenanceIntegrityResult;
}

export function getResearchLineage(
  investigationId: string,
  dependencies: ResearchLineageGraphDependencies,
): ResearchLineage {
  const investigations = dependencies.getResearchInvestigations();

  const experiments = dependencies.getResearchExperiments();

  const evidence = dependencies.getResearchEvidence();

  const findings = dependencies.getResearchFindings();

  const validations = dependencies.getResearchFindingValidations();

  const conclusions = dependencies.getResearchInvestigationConclusions();

  const investigation = investigations.find(
    (item) => item.id === investigationId,
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
    dependencies.getResearchProvenanceEventsByInvestigation(
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

  const addNode = (node: ResearchLineageNode) => {
    if (nodes.some((item) => item.id === node.id)) {
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
    const id = `${sourceId}:${type}:${targetId}`;

    if (edges.some((edge) => edge.id === id)) {
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
    dependencies
      .validateResearchProvenanceIntegrity()
      .issues.filter(
        (issue) =>
          issue.investigationId === investigationId,
      );

  addNode({
    id: investigation.id,
    type: "Investigation",
    title: investigation.title,
    description: investigation.question,
    status: investigation.status,
    investigationId,
    provenanceEventCount: provenanceCount(
      "Investigation",
      investigation.id,
    ),
    valid: true,
    issueCount: 0,
    missingLinks: [],
  });

  for (const experimentId of investigation.experimentIds) {
    const experiment = experiments.find(
      (item) => item.id === experimentId,
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
      description: experiment.objective,
      status: experiment.status,
      investigationId,
      provenanceEventCount: provenanceCount(
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
    const item = evidence.find(
      (candidate) => candidate.id === evidenceId,
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
      description: item.description,
      investigationId,
      provenanceEventCount: provenanceCount(
        "Evidence",
        item.id,
      ),
      valid: true,
      issueCount: 0,
      missingLinks: [],
    });
  }

  for (const findingId of investigation.findingIds) {
    const finding = findings.find(
      (item) => item.id === findingId,
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
      provenanceEventCount: provenanceCount(
        "Finding",
        finding.id,
      ),
      valid: true,
      issueCount: 0,
      missingLinks: [],
    });

    for (const assessment of finding.evidenceAssessments) {
      const evidenceItem = evidence.find(
        (item) =>
          item.id === assessment.evidenceId,
      );

      if (!evidenceItem) {
        continue;
      }

      const edgeType: ResearchLineageEdgeType =
        assessment.type === "Supporting"
          ? "Supports"
          : assessment.type === "Contradicting"
            ? "Contradicts"
            : "Supports";

      addEdge(
        evidenceItem.id,
        finding.id,
        edgeType,
        assessment.type,
      );
    }

    for (const validationId of finding.validationIds) {
      const validation = validations.find(
        (item) => item.id === validationId,
      );

      if (!validation) {
        addNode({
          id: validationId,
          type: "FindingValidation",
          title: "Missing validation",
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
        title: "Finding validation",
        description: validation.rationale,
        status: validation.status,
        investigationId,
        provenanceEventCount: provenanceCount(
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

  for (const conclusionId of investigation.conclusionIds) {
    const conclusion = conclusions.find(
      (item) => item.id === conclusionId,
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
      title: conclusion.statement,
      description: conclusion.uncertainty,
      status: conclusion.status,
      investigationId,
      provenanceEventCount: provenanceCount(
        "Conclusion",
        conclusion.id,
      ),
      valid: true,
      issueCount: 0,
      missingLinks: [],
    });

    for (const findingId of conclusion.supportingFindingIds) {
      addEdge(
        findingId,
        conclusion.id,
        "Supports",
        "Supports conclusion",
      );
    }

    for (const findingId of conclusion.contradictingFindingIds) {
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
      (total, node) => total + node.issueCount,
      0,
    );

  return {
    investigationId,
    nodes,
    edges,
    valid: issueCount === 0,
    issueCount,
  };
}
