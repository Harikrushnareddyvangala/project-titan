import type {
  CorrelatedInsight,
} from "@/types/correlation";

import type {
  RepositoryComparison,
} from "@/types/github";

import type {
  CorrelationRule,
} from "../ruleEngine";

export const HighRepositoryRiskRule: CorrelationRule = {

  id: "high-repository-risk",

  name: "High Repository Risk",

  evaluate(
    comparison: RepositoryComparison,
  ): CorrelatedInsight | null {

    const risk =
      comparison.repositoryRiskIntelligence;

    if (risk.overallRisk < 70) {
      return null;
    }

    return {

      title: "High Repository Risk",

      summary:
        "The overall engineering portfolio risk is above the acceptable threshold.",

      priority: "Critical",

      confidence: "High",

      signals: [

        {
          source: "Repository Risk",

          description:
            `Overall Risk Score: ${risk.overallRisk}`,
        },

      ],

      recommendation:
        "Prioritize the highest-risk repositories before introducing new engineering initiatives.",

    };

  },

};