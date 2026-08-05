import type {

  UnifiedCorrelationIntelligence,
  CorrelatedInsight,
  CorrelationSummary,

} from "@/types/correlation";

import type {

  RepositoryComparison,

} from "@/types/github";
import { executeRules } from "./correlation/ruleEngine";

import { correlationRules } from "./correlation/rules";

export function buildUnifiedCorrelation(

  comparison: RepositoryComparison,

): UnifiedCorrelationIntelligence {

  const insights =
  executeRules(
    comparison,
    correlationRules,
  );

  const summary =
    buildCorrelationSummary(
      insights,
    );

  return {

    insights,

    summary,

  };

}

// function buildCorrelatedInsights(
//   comparison: RepositoryComparison,
// ): CorrelatedInsight[] {

//   return [];

// }

function buildCorrelationSummary(
  insights: CorrelatedInsight[],
): CorrelationSummary {

  const criticalInsights =
    insights.filter(
      (insight) =>
        insight.priority === "Critical",
    ).length;

  const executiveNarrative =
    insights.length === 0
      ? "No significant cross-intelligence findings were detected."
      : `Generated ${insights.length} correlated insight${
          insights.length === 1 ? "" : "s"
        }, including ${criticalInsights} critical priorit${
          criticalInsights === 1 ? "y" : "ies"
        }.`;

  return {

    executiveNarrative,

    totalInsights:
      insights.length,

    criticalInsights,

  };

}