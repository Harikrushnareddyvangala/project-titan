/**
 * ============================================================================
 * TITAN AI Engineering Advisor
 * ============================================================================
 */

import type {
  ExecutionIntelligence,
} from "./execution";

export type AdvisorSeverity =
  | "Information"
  | "Recommendation"
  | "Warning"
  | "Critical";

export type AdvisorCategory =
  | "Engineering"
  | "Architecture"
  | "Security"
  | "Planning"
  | "Execution"
  | "Portfolio";

export interface AdvisorInsight {

  title: string;

  summary: string;

  category: AdvisorCategory;

  severity: AdvisorSeverity;

}
export interface AdvisorSummary {

  executiveNarrative: string;

  confidence: number;

}
export interface AdvisorIntelligence {

  insights: AdvisorInsight[];

  summary: AdvisorSummary;

}
export interface AdvisorInput {

  execution: ExecutionIntelligence;

}