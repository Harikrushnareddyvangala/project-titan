import type {
  PortfolioEvolution,
} from "@/lib/github/repositoryEvolutionService";

import type {
  PortfolioHistoricalTrend,
} from "@/lib/github/repositoryHistoricalTrendService";

import type {
  PortfolioForecast,
} from "@/lib/github/repositoryForecastService";

import type {
  PortfolioRisk,
} from "./risk";

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
export type ExecutiveSeverity =
  | "Information"
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type ExecutivePriority =
  | "Low"
  | "Medium"
  | "High"
  | "Immediate";

export type ExecutiveMaturity =
  | "Emerging"
  | "Developing"
  | "Established"
  | "Advanced"
  | "Elite";

export interface ExecutiveFinding {

  title: string;

  description: string;

  severity: ExecutiveSeverity;

}

export interface ExecutiveRecommendation {

  title: string;

  description: string;

  priority: ExecutivePriority;

}

export interface ExecutivePortfolioHealth {

  score: number;

  maturity: ExecutiveMaturity;

  confidence: number;

}

export interface ExecutiveSummary {

  title: string;

  overview: string;

  verdict: string;

}

export interface ExecutiveIntelligence {

  portfolioHealth: ExecutivePortfolioHealth;

  findings: ExecutiveFinding[];

  recommendations: ExecutiveRecommendation[];

  summary: ExecutiveSummary;

}

export interface ExecutiveInput {

  evolution: PortfolioEvolution;

  historicalTrend: PortfolioHistoricalTrend;

  forecast: PortfolioForecast;

  risk: PortfolioRisk;

}