import type {
  ResearchEvidenceAssessment,
} from "@/types/research";

export interface ResearchFindingAssessmentSummary {
  supportingEvidence: number;
  contradictingEvidence: number;
  neutralEvidence: number;

  averageRelevance: number;
  averageReliability: number;
  averageIndependence: number;

  supportScore: number;
  contradictionScore: number;

  derivedConfidence: number;
}

export interface ResearchFindingValidationEligibility {
  eligible: boolean;

  reasons: string[];

  evidenceAssessmentCount: number;

  supportingEvidenceCount: number;

  contradictingEvidenceCount: number;

  confidenceAvailable: boolean;
}

export function evaluateFindingValidationEligibility(
  assessments: ResearchEvidenceAssessment[],
  confidence?: number,
): ResearchFindingValidationEligibility {
  const reasons: string[] = [];

  const supportingEvidenceCount =
    assessments.filter(
      (assessment) =>
        assessment.type ===
        "Supporting",
    ).length;

  const contradictingEvidenceCount =
    assessments.filter(
      (assessment) =>
        assessment.type ===
        "Contradicting",
    ).length;

  if (
    assessments.length === 0
  ) {
    reasons.push(
      "At least one evidence assessment is required.",
    );
  }

  if (
    supportingEvidenceCount === 0
  ) {
    reasons.push(
      "At least one supporting evidence assessment is required.",
    );
  }

  const invalidAssessments =
    assessments.filter(
      (assessment) =>
        !isValidScore(
          assessment.relevance,
        ) ||
        !isValidScore(
          assessment.supportStrength,
        ) ||
        !isValidScore(
          assessment.reliability,
        ) ||
        !isValidScore(
          assessment.independence,
        ),
    );

  if (
    invalidAssessments.length > 0
  ) {
    reasons.push(
      "All evidence assessment scores must be between 0 and 1.",
    );
  }

  const confidenceAvailable =
    confidence !== undefined &&
    isValidScore(confidence);

  if (!confidenceAvailable) {
    reasons.push(
      "A valid finding confidence score is required.",
    );
  }

  return {
    eligible:
      reasons.length === 0,

    reasons,

    evidenceAssessmentCount:
      assessments.length,

    supportingEvidenceCount,

    contradictingEvidenceCount,

    confidenceAvailable,
  };
}

function isValidScore(
  value: number,
): boolean {
  return (
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}

/**
 * Produces a transparent assessment summary.
 *
 * This is an engineering scoring model, not a calibrated
 * statistical probability.
 */
export function summarizeEvidenceAssessments(
  assessments: ResearchEvidenceAssessment[],
): ResearchFindingAssessmentSummary {
  if (assessments.length === 0) {
    return {
      supportingEvidence: 0,
      contradictingEvidence: 0,
      neutralEvidence: 0,
      averageRelevance: 0,
      averageReliability: 0,
      averageIndependence: 0,
      supportScore: 0,
      contradictionScore: 0,
      derivedConfidence: 0,
    };
  }

  const supporting =
    assessments.filter(
      (item) =>
        item.type === "Supporting",
    );

  const contradicting =
    assessments.filter(
      (item) =>
        item.type === "Contradicting",
    );

  const neutral =
    assessments.filter(
      (item) =>
        item.type === "Neutral",
    );

  const average = (
    values: number[],
  ): number => {
    if (values.length === 0) {
      return 0;
    }

    return (
      values.reduce(
        (sum, value) =>
          sum + value,
        0,
      ) / values.length
    );
  };

  const averageRelevance =
    average(
      assessments.map(
        (item) =>
          item.relevance,
      ),
    );

  const averageReliability =
    average(
      assessments.map(
        (item) =>
          item.reliability,
      ),
    );

  const averageIndependence =
    average(
      assessments.map(
        (item) =>
          item.independence,
      ),
    );

  const supportScore =
    average(
      supporting.map(
        (item) =>
          item.supportStrength *
          item.relevance *
          item.reliability *
          item.independence,
      ),
    );

  const contradictionScore =
    average(
      contradicting.map(
        (item) =>
          item.supportStrength *
          item.relevance *
          item.reliability *
          item.independence,
      ),
    );

  const balance =
    supportScore /
    Math.max(
      0.0001,
      supportScore +
        contradictionScore,
    );

  const derivedConfidence =
    Math.min(
      1,
      Math.max(
        0,
        balance *
          averageReliability *
          averageRelevance,
      ),
    );

  return {
    supportingEvidence:
      supporting.length,

    contradictingEvidence:
      contradicting.length,

    neutralEvidence:
      neutral.length,

    averageRelevance,

    averageReliability,

    averageIndependence,

    supportScore,

    contradictionScore,

    derivedConfidence,
  };
}