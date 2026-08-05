/**
 * ============================================================================
 * TITAN Engineering Observability
 * ============================================================================
 */

export type TrendDirection =
  | "Improving"
  | "Stable"
  | "Declining";

export type RegressionSeverity =
  | "None"
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

  export interface EngineeringKPI {

  title: string;

  currentValue: number;

  previousValue: number;

  change: number;

  direction: TrendDirection;

}

export interface RegressionAlert {

  title: string;

  description: string;

  severity: RegressionSeverity;

}

export interface ReleaseReadiness {

  score: number;

  summary: string;

}

export interface ObservabilitySummary {

  executiveNarrative: string;

  confidence: number;

}

export interface EngineeringObservability {

  kpis: EngineeringKPI[];

  regressions: RegressionAlert[];

  releaseReadiness: ReleaseReadiness;

  summary: ObservabilitySummary;

}