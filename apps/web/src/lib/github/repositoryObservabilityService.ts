import type {

  EngineeringObservability,
  EngineeringKPI,
  RegressionAlert,
  ReleaseReadiness,
  ObservabilitySummary,

} from "@/types/observability";

import type {

  RepositoryComparison,

} from "@/types/github";    
export function buildEngineeringObservability(

  comparison: RepositoryComparison,

): EngineeringObservability {

  const kpis =
    buildEngineeringKPIs(
      comparison,
    );

  const regressions =
    buildRegressionAlerts(
      comparison,
    );

  const releaseReadiness =
    buildReleaseReadiness(
      comparison,
    );

  const summary =
    buildObservabilitySummary({

      kpis,

      regressions,

      releaseReadiness,

    });

  return {

    kpis,

    regressions,

    releaseReadiness,

    summary,

  };

}
function buildEngineeringKPIs(

  comparison: RepositoryComparison,

): EngineeringKPI[] {

  const kpis: EngineeringKPI[] = [];

  const trendSummary =
    comparison.historicalTrend?.summary;

  if (!trendSummary) {

    return kpis;

  }

  kpis.push({

    title: "Engineering Growth",

    currentValue:
      trendSummary.averageEngineeringGrowth,

    previousValue:
      trendSummary.averageEngineeringGrowth,

    change: 0,

    direction: "Stable",

  });

  kpis.push({

    title: "Security Growth",

    currentValue:
      trendSummary.averageSecurityGrowth,

    previousValue:
      trendSummary.averageSecurityGrowth,

    change: 0,

    direction: "Stable",

  });

  kpis.push({

    title: "Enterprise Growth",

    currentValue:
      trendSummary.averageEnterpriseGrowth,

    previousValue:
      trendSummary.averageEnterpriseGrowth,

    change: 0,

    direction: "Stable",

  });

  kpis.push({

    title: "Hiring Growth",

    currentValue:
      trendSummary.averageHiringGrowth,

    previousValue:
      trendSummary.averageHiringGrowth,

    change: 0,

    direction: "Stable",

  });

  return kpis;

}
function buildRegressionAlerts(

  comparison: RepositoryComparison,

): RegressionAlert[] {

  const alerts: RegressionAlert[] = [];

  const summary =
    comparison.historicalTrend?.summary;

  if (!summary) {

    return alerts;

  }

  if (
    summary.averageEngineeringGrowth < 0
  ) {

    alerts.push({

      title:
        "Engineering Regression",

      description:
        "Average engineering growth is negative across the portfolio.",

      severity:
        "High",

    });

  }

  if (
    summary.averageSecurityGrowth < 0
  ) {

    alerts.push({

      title:
        "Security Regression",

      description:
        "Security maturity has declined over recent snapshots.",

      severity:
        "Critical",

    });

  }

  if (
    summary.averageEnterpriseGrowth < 0
  ) {

    alerts.push({

      title:
        "Enterprise Regression",

      description:
        "Enterprise readiness trend is declining.",

      severity:
        "Medium",

    });

  }

  if (
    summary.averageHiringGrowth < 0
  ) {

    alerts.push({

      title:
        "Hiring Regression",

      description:
        "Hiring readiness trend is weakening.",

      severity:
        "Low",

    });

  }

  return alerts;

}
function buildReleaseReadiness(

  comparison: RepositoryComparison,

): ReleaseReadiness {

  const score = Math.round(

    (
      comparison.averageEngineeringScore +
      comparison.averageSecurityScore +
      comparison.averageEnterpriseReadiness
    ) / 3,

  );

  let summary: string;

  if (score >= 90) {

    summary =
      "The engineering portfolio is in an excellent state and appears ready for release.";

  } else if (score >= 80) {

    summary =
      "The portfolio is generally ready for release with only minor improvements recommended.";

  } else if (score >= 70) {

    summary =
      "Release readiness is acceptable, but engineering improvements should be considered before major releases.";

  } else {

    summary =
      "Release readiness is currently below the desired threshold. Engineering improvements are recommended before release.";

  }

  return {

    score,

    summary,

  };

}
function buildObservabilitySummary(

  input: {

    kpis: EngineeringKPI[];

    regressions: RegressionAlert[];

    releaseReadiness: ReleaseReadiness;

  },

): ObservabilitySummary {

  const improving =
    input.kpis.filter(
      (kpi) => kpi.direction === "Improving",
    ).length;

  const declining =
    input.kpis.filter(
      (kpi) => kpi.direction === "Declining",
    ).length;

  const confidence =
    Math.max(
      0,
      Math.min(
        100,
        input.releaseReadiness.score,
      ),
    );

  const executiveNarrative =
    `Engineering observability reports ${improving} improving KPI${
      improving === 1 ? "" : "s"
    } and ${declining} declining KPI${
      declining === 1 ? "" : "s"
    }. ` +
    `${input.regressions.length} regression alert${
      input.regressions.length === 1 ? "" : "s"
    } ${
      input.regressions.length === 1 ? "has" : "have"
    } been detected. ` +
    `Overall release readiness is ${input.releaseReadiness.score}%.`;

  return {

    executiveNarrative,

    confidence,

  };

}