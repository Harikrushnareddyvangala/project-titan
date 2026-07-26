import type {
  DeveloperDNA,
  CareerIntelligence,
  EngineeringMentor,
  TeamCompatibility,
} from "@/types/github";

export type EngineeringGrade =
  | "A+"
  | "A"
  | "B+"
  | "B"
  | "C";

export type RepositoryHealth =
  | "Exceptional"
  | "Excellent"
  | "Good"
  | "Average"
  | "Needs Improvement";

export interface EngineeringExecutiveSummary {
  overallScore: number;

  engineeringGrade: EngineeringGrade;

  repositoryHealth: RepositoryHealth;

  strengths: string[];

  improvementAreas: string[];

  executiveSummary: string;

  recommendation: string;
}

export interface ExecutiveSummaryInput {
  developerDNA: DeveloperDNA;
  career: CareerIntelligence;
  mentor: EngineeringMentor;
  team: TeamCompatibility;
}

export function buildEngineeringExecutiveSummary({
  developerDNA,
  career,
  mentor,
  team,
}: ExecutiveSummaryInput): EngineeringExecutiveSummary {
  const overallScore = Math.round(
    (
      developerDNA.engineeringScore +
      career.promotionReadiness +
      team.compatibilityScore +
      team.leadershipReadiness
    ) / 4
  );

  const engineeringGrade: EngineeringGrade =
    overallScore >= 95
      ? "A+"
      : overallScore >= 90
      ? "A"
      : overallScore >= 85
      ? "B+"
      : overallScore >= 75
      ? "B"
      : "C";

  const repositoryHealth: RepositoryHealth =
    overallScore >= 95
      ? "Exceptional"
      : overallScore >= 90
      ? "Excellent"
      : overallScore >= 80
      ? "Good"
      : overallScore >= 70
      ? "Average"
      : "Needs Improvement";

  const strengths = [
    `Engineering Maturity: ${mentor.maturityLevel}`,
    `Career Stage: ${career.careerStage}`,
    `Ideal Role: ${team.idealRole}`,
  ];

  const improvementAreas = [
    mentor.learningPriority,
    ...mentor.recommendedSkills.slice(0, 2),
  ];

  return {
    overallScore,
    engineeringGrade,
    repositoryHealth,
    strengths,
    improvementAreas,
    executiveSummary:
      `This repository demonstrates ${repositoryHealth.toLowerCase()} engineering practices with an overall score of ${overallScore}. The developer shows ${career.careerStage.toLowerCase()} career readiness and ${mentor.maturityLevel.toLowerCase()} engineering maturity.`,

    recommendation:
      `Focus on ${mentor.learningPriority} while continuing to build leadership and enterprise-scale engineering experience.`,
  };
}