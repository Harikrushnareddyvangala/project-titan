/**
 * ============================================================================
 * TITAN Engineering Intelligence Platform
 * Repository Risk Domain Model
 * ============================================================================
 *
 * Defines the shared risk language used across
 * the Repository Risk Intelligence Engine.
 *
 * This file contains:
 * • Risk enums
 * • Risk interfaces
 * • Portfolio risk models
 * • Shared constants
 *
 * ============================================================================
 */
import type {
  PortfolioForecast,
} from "@/lib/github/repositoryForecastService";

import type {
  PortfolioHistoricalTrend,
} from "@/lib/github/repositoryHistoricalTrendService";

import type {
  RiskLevel,
} from "./intelligence";
export type RiskCategory =
  | "Engineering"
  | "Security"
  | "Production"
  | "Enterprise"
  | "Hiring"
  | "Architecture"
  | "Operations"
  | "Maintainability";

  export type RiskSeverity =
  | "Info"
  | "Warning"
  | "Severe"
  | "Critical";

  export type RiskPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

  export type RiskTrend =
  | "Rapidly Improving"
  | "Improving"
  | "Stable"
  | "Worsening"
  | "Rapidly Worsening";

  export interface RepositoryRisk {

  repositoryName: string;

  category: RiskCategory;

  level: RiskLevel;

  severity: RiskSeverity;

  priority: RiskPriority;

  trend: RiskTrend;

  score: number;

  confidence: number;

  explanation: string;

  recommendation: string;

}

export interface RepositoryRiskSummary {

  overallRisk: RiskLevel;

  overallScore: number;

  confidence: number;

  repositoryCount: number;

  highestRiskRepository: string;

  safestRepository: string;

}

export interface RiskDistribution {

  veryLow: number;

  low: number;

  moderate: number;

  elevated: number;

  high: number;

  critical: number;

}

export interface ExecutiveRiskInsight {

  title: string;

  summary: string;

  recommendation: string;

}

export interface PortfolioRisk {

  repositories: RepositoryRisk[];

  summary: RepositoryRiskSummary;

  distribution: RiskDistribution;

  executive: ExecutiveRiskInsight;

}




export interface RepositoryRiskInput {

  forecast: PortfolioForecast;

  historicalTrend: PortfolioHistoricalTrend;

}