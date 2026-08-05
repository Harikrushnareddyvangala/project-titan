/**
 * ============================================================================
 * TITAN Unified Intelligence Correlation
 * ============================================================================
 */

export type InsightPriority =
  | "Critical"
  | "High"
  | "Medium"
  | "Low";

export type InsightConfidence =
  | "Very High"
  | "High"
  | "Medium"
  | "Low";

  export interface CorrelatedSignal {

  source: string;

  description: string;

}

export interface CorrelatedInsight {

  title: string;

  summary: string;

  priority: InsightPriority;

  confidence: InsightConfidence;

  signals: CorrelatedSignal[];

  recommendation: string;

}

export interface CorrelationSummary {

  executiveNarrative: string;

  totalInsights: number;

  criticalInsights: number;

}

export interface UnifiedCorrelationIntelligence {

  insights: CorrelatedInsight[];

  summary: CorrelationSummary;

}