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