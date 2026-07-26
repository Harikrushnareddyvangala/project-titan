export interface EngineeringExecutiveSummary {
  overallScore: number;

  engineeringGrade: "A+" | "A" | "B+" | "B" | "C";

  repositoryHealth:
    | "Exceptional"
    | "Excellent"
    | "Good"
    | "Average"
    | "Needs Improvement";

  strengths: string[];

  improvementAreas: string[];

  executiveSummary: string;

  recommendation: string;
}