import type { ResourceIdentity, ResourceRelationship } from "@titan/types";
import type {
  ResearchEvidenceAssessment,
  ResearchEvidenceAssessmentType,
  ResearchFinding,
  ResearchFindingValidation,
} from "@/types/research";

function createResearchResourceIdentity(
  id: string,
  type: "evidence" | "finding" | "validation",
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

export function toResearchFindingValidationResourceRelationship(
  finding: ResearchFinding,
  validation: ResearchFindingValidation,
): ResourceRelationship | null {
  if (validation.findingId !== finding.id) {
    return null;
  }

  return {
    id: createResearchRelationshipIdentity(
      validation.id,
      "Validates",
    ),
    source: createResearchResourceIdentity(
      finding.id,
      "finding",
    ),
    target: createResearchResourceIdentity(
      validation.id,
      "validation",
    ),
    namespace: "research",
    type: "Validates",
    createdAt: validation.createdAt,
  };
}
