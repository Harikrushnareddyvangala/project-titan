import type {
  CorrelatedInsight,
} from "@/types/correlation";

import type {
  RepositoryComparison,
} from "@/types/github";

import type {
  CorrelationRule,
} from "../ruleEngine";

export const ReleaseReadinessRule: CorrelationRule = {

  id: "release-readiness",

  name: "Release Readiness",

  evaluate(
    comparison: RepositoryComparison,
  ): CorrelatedInsight | null {

    const observability =
      comparison.engineeringObservability;

    if (!observability) {
      return null;
    }

    const readiness =
      observability.releaseReadiness.score;

    if (readiness < 90) {
      return null;
    }

    return {

      title:
        "Portfolio Ready for Release",

      summary:
        "Engineering observability indicates excellent release readiness across the portfolio.",

      priority:
        "Low",

      confidence:
        "Very High",

      signals: [

        {
          source:
            "Engineering Observability",

          description:
            `Release readiness: ${readiness}%`,
        },

      ],

      recommendation:
        "Maintain current engineering practices and continue monitoring key quality indicators.",

    };

  },

};