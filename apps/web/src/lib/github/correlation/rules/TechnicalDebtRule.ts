import type {
  CorrelatedInsight,
} from "@/types/correlation";

import type {
  RepositoryComparison,
} from "@/types/github";

import type {
  CorrelationRule,
} from "../ruleEngine";

export const TechnicalDebtRule: CorrelationRule = {

  id: "technical-debt",

  name: "Technical Debt",

  evaluate(
    comparison: RepositoryComparison,
  ): CorrelatedInsight | null {

    const quality =
      comparison.engineeringQuality;

    const risk =
      comparison.repositoryRiskIntelligence;

    if (!quality) {
      return null;
    }

    if (
      quality.technicalDebt.level !== "High"
    ) {
      return null;
    }

    return {

      title:
        "Technical Debt Requires Attention",

      summary:
        "High technical debt is contributing to engineering risk.",

      priority:
        risk.overallRisk >= 70
          ? "Critical"
          : "High",

      confidence:
        "High",

      signals: [

        {
          source:
            "Engineering Quality",

          description:
            `Technical debt: ${quality.technicalDebt.level}`,
        },

        {
          source:
            "Repository Risk",

          description:
            `Overall risk: ${risk.overallRisk}`,
        },

      ],

      recommendation:
        "Reduce technical debt before introducing significant new functionality.",

    };

  },

};