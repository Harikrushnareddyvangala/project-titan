import type { ResourceIdentity } from "@titan/types";
import type {
  ResearchEvidence,
  ResearchExperiment,
  ResearchFinding,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
} from "@/types/research";

export type ResearchResourceType =
  | "investigation"
  | "experiment"
  | "evidence"
  | "finding"
  | "conclusion";

function createResearchResourceIdentity(
  id: string,
  type: ResearchResourceType,
): ResourceIdentity {
  return {
    id,
    type,
    namespace: "research",
  };
}

export function toResearchInvestigationResourceIdentity(
  investigation: ResearchInvestigation,
): ResourceIdentity {
  return createResearchResourceIdentity(investigation.id, "investigation");
}

export function toResearchExperimentResourceIdentity(
  experiment: ResearchExperiment,
): ResourceIdentity {
  return createResearchResourceIdentity(experiment.id, "experiment");
}

export function toResearchEvidenceResourceIdentity(
  evidence: ResearchEvidence,
): ResourceIdentity {
  return createResearchResourceIdentity(evidence.id, "evidence");
}

export function toResearchFindingResourceIdentity(
  finding: ResearchFinding,
): ResourceIdentity {
  return createResearchResourceIdentity(finding.id, "finding");
}

export function toResearchConclusionResourceIdentity(
  conclusion: ResearchInvestigationConclusion,
): ResourceIdentity {
  return createResearchResourceIdentity(conclusion.id, "conclusion");
}
