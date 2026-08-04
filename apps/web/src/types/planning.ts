/**
 * ============================================================================
 * TITAN Strategic Planning Intelligence
 * ============================================================================
 */

import type {
  DecisionIntelligence,
} from "./decision";

export type PlanningPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type PlanningStatus =
  | "Planned"
  | "Active"
  | "Completed";

export type PlanningHorizon =
  | "30 Days"
  | "90 Days"
  | "6 Months"
  | "12 Months";

  export interface StrategicInitiative {

  title: string;

  description: string;

  priority: PlanningPriority;

  status: PlanningStatus;

  horizon: PlanningHorizon;

}
export interface PlanningSummary {

  planningConfidence: number;

  activeInitiatives: number;

  roadmapHorizon: PlanningHorizon;

  executiveOverview: string;

}

export interface PlanningIntelligence {

  initiatives: StrategicInitiative[];

  summary: PlanningSummary;

}

export interface PlanningInput {

  decision: DecisionIntelligence;

}