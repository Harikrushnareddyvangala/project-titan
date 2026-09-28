import type { ResourceIdentity, ResourceRelationship } from "@titan/types";
import type {
  ResearchEvidenceAssessment,
  ResearchEvidenceAssessmentType,
  ResearchFinding,
} from "@/types/research";

function createResearchResourceIdentity(
  id: string,
  type: "evidence" | "finding",
): ResourceIdentity {
  return {
    id,
    type,
    namespace: "research",
  };
}

function mapResearchEvidenceAssessmentRelationshipType(
  type: ResearchEvidenceAssessmentType,
): ResourceRelationship["type"] | null {
  switch (type) {
    case "Supporting":
      return "Supports";
    case "Contradicting":
      return "Contradicts";
    case "Neutral":
      return null;
  }
}

function createResearchRelationshipIdentity(
  assessmentId: string,
  relationshipType: ResourceRelationship["type"],
): string {
  return `relationship-${assessmentId}-${relationshipType}`;
}

export function toResearchEvidenceAssessmentResourceRelationship(
  finding: ResearchFinding,
  assessment: ResearchEvidenceAssessment,
): ResourceRelationship | null {
  const relationshipType =
    mapResearchEvidenceAssessmentRelationshipType(assessment.type);

  if (relationshipType === null) {
    return null;
  }

  return {
    id: createResearchRelationshipIdentity(
      assessment.id,
      relationshipType,
    ),
    source: createResearchResourceIdentity(
      assessment.evidenceId,
      "evidence",
    ),
    target: createResearchResourceIdentity(
      finding.id,
      "finding",
    ),
    namespace: "research",
    type: relationshipType,
    createdAt: assessment.assessedAt,
  };
}
