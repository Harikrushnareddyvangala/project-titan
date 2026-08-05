import type {
  CorrelatedInsight,
} from "@/types/correlation";

import type {
  RepositoryComparison,
} from "@/types/github";

import type {
  CorrelationRule,
} from "../ruleEngine";

export const RegressionRule: CorrelationRule = {

  id: "engineering-regression",

  name: "Engineering Regression",

  evaluate(
    comparison: RepositoryComparison,
  ): CorrelatedInsight | null {

    const observability =
      comparison.engineeringObservability;

    const quality =
      comparison.engineeringQuality;

    if (
      !observability ||
      !quality
    ) {
      return null;
    }

    if (
      observability.regressions.length === 0
    ) {
      return null;
    }

    if (
      quality.opportunities.length === 0
    ) {
      return null;
    }

    return {

      title:
        "Engineering Regression Detected",

      summary:
        "Active engineering regressions align with identified refactoring opportunities.",

      priority:
        observability.regressions.length >= 3
          ? "Critical"
          : "High",

      confidence:
        "High",

      signals: [

        {
          source:
            "Engineering Observability",

          description:
            `${observability.regressions.length} regression alert(s) detected.`,
        },

        {
          source:
            "Engineering Quality",

          description:
            `${quality.opportunities.length} refactoring opportunity(ies) available.`,
        },

      ],

      recommendation:
        "Prioritize the highest-impact refactoring opportunities to reduce ongoing engineering regressions.",

    };

  },

};