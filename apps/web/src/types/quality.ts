/**
 * ============================================================================
 * TITAN Engineering Quality Intelligence
 * ============================================================================
 */

export type QualityGrade =
  | "A+"
  | "A"
  | "B+"
  | "B"
  | "C"
  | "D";

export type MaintainabilityLevel =
  | "Excellent"
  | "Good"
  | "Fair"
  | "Poor";

export type TechnicalDebtLevel =
  | "Very Low"
  | "Low"
  | "Moderate"
  | "High"
  | "Critical";

  export interface MaintainabilityAnalysis {

  score: number;

  level: MaintainabilityLevel;

  strengths: string[];

  weaknesses: string[];

}

export interface TechnicalDebtAnalysis {

  score: number;

  level: TechnicalDebtLevel;

  estimatedRefactoringEffort: string;

  debtDrivers: string[];

}

export interface ComplexityAnalysis {

  score: number;

  hotspots: string[];

  recommendations: string[];

}

export interface RefactoringOpportunity {

  title: string;

  description: string;

  impact: "Low" | "Medium" | "High";

}

export interface EngineeringQualitySummary {

  overallScore: number;

  qualityGrade: QualityGrade;

  executiveSummary: string;

}

export interface EngineeringQualityIntelligence {

  maintainability: MaintainabilityAnalysis;

  technicalDebt: TechnicalDebtAnalysis;

  complexity: ComplexityAnalysis;

  opportunities: RefactoringOpportunity[];

  summary: EngineeringQualitySummary;

}