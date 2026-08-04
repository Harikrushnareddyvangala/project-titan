/**
 * ============================================================================
 * TITAN Engineering Execution Intelligence
 * ============================================================================
 */

import type {
  PlanningIntelligence,
} from "./planning";

export type ExecutionStatus =
  | "Not Started"
  | "In Progress"
  | "Blocked"
  | "Completed";

export type ExecutionHealth =
  | "Excellent"
  | "Good"
  | "Needs Attention"
  | "Critical";

  export interface ExecutionItem {

  title: string;

  description: string;

  status: ExecutionStatus;

  progress: number;

  confidence: number;

}

export interface ExecutionSummary {

  overallProgress: number;

  executionHealth: ExecutionHealth;

  deliveryConfidence: number;

  executiveOverview: string;

}

export interface ExecutionIntelligence {

  executions: ExecutionItem[];

  summary: ExecutionSummary;

}

export interface ExecutionInput {

  planning: PlanningIntelligence;

}