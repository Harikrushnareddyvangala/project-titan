import type {
  ResearchExperiment,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchProvenanceEvent,
  ResearchProvenanceIntegrityIssue,
  ResearchProvenanceIntegrityResult,
} from "@/types/research";

export interface ResearchProvenanceIntegrityDependencies {
  getResearchProvenanceEvents(): ResearchProvenanceEvent[];
  getResearchInvestigations(): ResearchInvestigation[];
  getResearchExperiments(): ResearchExperiment[];
  getResearchFindings(): ResearchFinding[];
  getResearchFindingValidations(): ResearchFindingValidation[];
  getResearchInvestigationConclusions(): ResearchInvestigationConclusion[];
}

export function validateResearchProvenanceIntegrity(
  dependencies: ResearchProvenanceIntegrityDependencies,
): ResearchProvenanceIntegrityResult {
  const events = dependencies.getResearchProvenanceEvents();

  const investigations = dependencies.getResearchInvestigations();

  const experiments = dependencies.getResearchExperiments();

  const findings = dependencies.getResearchFindings();

  const validations = dependencies.getResearchFindingValidations();

  const conclusions = dependencies.getResearchInvestigationConclusions();

  const issues: ResearchProvenanceIntegrityIssue[] = [];

  const addIssue = (
    event: ResearchProvenanceEvent,
    code: string,
    message: string,
  ): void => {
    issues.push({
      eventId: event.id,
      investigationId: event.investigationId,
      entityType: event.entityType,
      entityId: event.entityId,
      code,
      message,
    });
  };

  for (const event of events) {
    const investigation = investigations.find(
      (item) => item.id === event.investigationId,
    );

    if (!investigation) {
      addIssue(
        event,
        "INVESTIGATION_NOT_FOUND",
        `Investigation ${event.investigationId} was not found.`,
      );

      continue;
    }

    const timestamp = new Date(event.timestamp).getTime();

    if (Number.isNaN(timestamp)) {
      addIssue(
        event,
        "INVALID_TIMESTAMP",
        `Provenance event ${event.id} has an invalid timestamp.`,
      );
    }

    switch (event.entityType) {
      case "Investigation": {
        if (event.entityId !== investigation.id) {
          addIssue(
            event,
            "ENTITY_INVESTIGATION_MISMATCH",
            `Event entity ${event.entityId} does not match investigation ${investigation.id}.`,
          );
        }

        break;
      }

      case "Experiment": {
        const experiment = experiments.find(
          (item) => item.id === event.entityId,
        );

        if (!experiment) {
          addIssue(
            event,
            "EXPERIMENT_NOT_FOUND",
            `Experiment ${event.entityId} was not found.`,
          );

          break;
        }

        if (experiment.investigationId !== investigation.id) {
          addIssue(
            event,
            "EXPERIMENT_INVESTIGATION_MISMATCH",
            `Experiment ${event.entityId} does not belong to investigation ${investigation.id}.`,
          );
        }

        break;
      }

      case "FindingValidation": {
        const validation = validations.find(
          (item) => item.id === event.entityId,
        );

        if (!validation) {
          addIssue(
            event,
            "VALIDATION_NOT_FOUND",
            `Finding validation ${event.entityId} was not found.`,
          );

          break;
        }

        const finding = findings.find(
          (item) => item.id === validation.findingId,
        );

        if (!finding) {
          addIssue(
            event,
            "VALIDATION_FINDING_NOT_FOUND",
            `Finding ${validation.findingId} referenced by validation ${validation.id} was not found.`,
          );

          break;
        }

        if (!investigation.findingIds.includes(finding.id)) {
          addIssue(
            event,
            "FINDING_INVESTIGATION_MISMATCH",
            `Finding ${finding.id} does not belong to investigation ${investigation.id}.`,
          );
        }

        break;
      }

      case "Conclusion": {
        const conclusion = conclusions.find(
          (item) => item.id === event.entityId,
        );

        if (!conclusion) {
          addIssue(
            event,
            "CONCLUSION_NOT_FOUND",
            `Conclusion ${event.entityId} was not found.`,
          );

          break;
        }

        if (conclusion.investigationId !== investigation.id) {
          addIssue(
            event,
            "CONCLUSION_INVESTIGATION_MISMATCH",
            `Conclusion ${event.entityId} does not belong to investigation ${investigation.id}.`,
          );
        }

        break;
      }

      case "Evidence":
      case "EvidenceAssessment":
      case "Finding":
        break;
    }
  }

  return {
    valid: issues.length === 0,
    checkedEventCount: events.length,
    issues,
  };
}
