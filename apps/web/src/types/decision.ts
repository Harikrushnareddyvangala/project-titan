/**
 * ============================================================================
 * TITAN Decision Intelligence
 * ============================================================================
 */

import type {
  ExecutiveIntelligence,
} from "./executive";

export type DecisionPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type DecisionStatus =
  | "Planned"
  | "Recommended"
  | "In Progress"
  | "Completed";

export type DecisionImpact =
  | "Low"
  | "Moderate"
  | "High"
  | "Transformational";

  export interface EngineeringDecision {

  title: string;

  description: string;

  priority: DecisionPriority;

  impact: DecisionImpact;

  confidence: number;

  status: DecisionStatus;

}
export interface DecisionSummary {

  overallConfidence: number;

  strategicPriority: DecisionPriority;

  executiveOverview: string;

}
export interface DecisionIntelligence {

  decisions: EngineeringDecision[];

  summary: DecisionSummary;

}
export interface DecisionInput {

  executive: ExecutiveIntelligence;

}