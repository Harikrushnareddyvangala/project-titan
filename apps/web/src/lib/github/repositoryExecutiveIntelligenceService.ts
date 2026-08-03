import type {

  ExecutiveFinding,
  ExecutiveInput,
  ExecutiveIntelligence,
  ExecutiveMaturity,
  ExecutivePortfolioHealth,
  ExecutiveRecommendation,
  ExecutiveSeverity,
  ExecutiveSummary,

} from "@/types/executive";

import type {

  RiskLevel,

} from "@/types/intelligence";

export function buildExecutiveIntelligence(

  input: ExecutiveInput,

): ExecutiveIntelligence {
    console.log("Executive Input", input);

console.log("Evolution", input.evolution);

console.log("Historical", input.historicalTrend);

console.log("Forecast", input.forecast);

console.log("Risk", input.risk);

  const portfolioHealth =
    buildExecutivePortfolioHealth(
      input,
    );

  const findings =
    buildExecutiveFindings(
      input,
    );

  const recommendations =
    buildExecutiveRecommendations(
      input,
    );

  const summary =
    buildExecutiveSummary(
      input,
      portfolioHealth,
      findings,
    );

  return {

    portfolioHealth,

    findings,

    recommendations,

    summary,

  };

}

function buildExecutivePortfolioHealth(
  input: ExecutiveInput,
): ExecutivePortfolioHealth {

  const score =
    (
      input.forecast.overallPortfolioForecast +
      input.risk.summary.overallScore
    ) / 2;

  let maturity: ExecutiveMaturity;

  if (score >= 95) {

    maturity = "Elite";

  } else if (score >= 85) {

    maturity = "Advanced";

  } else if (score >= 70) {

    maturity = "Established";

  } else if (score >= 55) {

    maturity = "Developing";

  } else {

    maturity = "Emerging";

  }

  const confidence =
    (
      input.forecast.forecastConfidence +
      input.risk.summary.confidence
    ) / 2;

  return {

    score,

    maturity,

    confidence,

  };

}

function buildExecutiveFindings(
  input: ExecutiveInput,
): ExecutiveFinding[] {

  const findings: ExecutiveFinding[] = [];

  /*
  ----------------------------------------
  Forecast
  ----------------------------------------
  */

  if (
    input.forecast.overallPortfolioForecast >= 90
  ) {

    findings.push({

      title:
        "Strong Engineering Forecast",

      description:
        "Portfolio engineering indicators project sustained growth over upcoming repository iterations.",

      severity:
        "Information",

    });

  } else if (
    input.forecast.overallPortfolioForecast < 70
  ) {

    findings.push({

      title:
        "Engineering Forecast Weakening",

      description:
        "Forecast intelligence predicts slowing engineering maturity requiring executive attention.",

      severity:
        "Medium",

    });

  }

  /*
  ----------------------------------------
  Risk
  ----------------------------------------
  */

  switch (
    input.risk.summary.overallRisk
  ) {

    case "Critical":

      findings.push({

        title:
          "Critical Portfolio Risk",

        description:
          "Engineering portfolio contains repositories with critical projected risk requiring immediate intervention.",

        severity:
          "Critical",

      });

      break;

    case "High":

      findings.push({

        title:
          "Elevated Engineering Risk",

        description:
          "Multiple repositories exhibit elevated future engineering risk.",

        severity:
          "High",

      });

      break;

    case "Moderate":

      findings.push({

        title:
          "Moderate Engineering Risk",

        description:
          "Portfolio risk remains manageable but should continue to be monitored.",

        severity:
          "Medium",

      });

      break;

    default:

      findings.push({

        title:
          "Engineering Risk Under Control",

        description:
          "Current portfolio risk profile remains within acceptable engineering limits.",

        severity:
          "Information",

      });

  }

  /*
  ----------------------------------------
  Evolution
  ----------------------------------------
  */

  if (
    input.evolution.summary.overallPortfolioChange > 5
  ) {

    findings.push({

      title:
        "Engineering Velocity Increasing",

      description:
        "Repository evolution indicates accelerating engineering improvements.",

      severity:
        "Information",

    });

  }

  /*
  ----------------------------------------
  Historical Trend
  ----------------------------------------
  */

  if (
    input.historicalTrend.summary.overallPortfolioGrowth < 0
  ) {

    findings.push({

      title:
        "Historical Engineering Decline",

      description:
        "Long-term engineering trend shows declining portfolio maturity.",

      severity:
        "High",

    });

  }

  return findings;

}
function buildExecutiveRecommendations(
  input: ExecutiveInput,
): ExecutiveRecommendation[] {

  const recommendations: ExecutiveRecommendation[] = [];

  /*
  --------------------------------------------------
  Portfolio Risk
  --------------------------------------------------
  */

  if (
    input.risk.summary.overallRisk === "Critical"
  ) {

    recommendations.push({

      title:
        "Immediate Risk Mitigation",

      description:
        "Prioritize engineering effort toward repositories with critical projected risk before introducing additional features.",

      priority:
        "Immediate",

    });

  } else if (
    input.risk.summary.overallRisk === "High"
  ) {

    recommendations.push({

      title:
        "Reduce Engineering Risk",

      description:
        "Focus engineering investment on reducing projected portfolio risk over the next development cycle.",

      priority:
        "High",

    });

  }

  /*
  --------------------------------------------------
  Forecast
  --------------------------------------------------
  */

  if (
    input.forecast.overallPortfolioForecast < 75
  ) {

    recommendations.push({

      title:
        "Improve Engineering Forecast",

      description:
        "Increase engineering quality initiatives to improve long-term portfolio outlook.",

      priority:
        "High",

    });

  }

  /*
  --------------------------------------------------
  Historical Trend
  --------------------------------------------------
  */

  if (
    input.historicalTrend.summary.overallPortfolioGrowth < 0
  ) {

    recommendations.push({

      title:
        "Reverse Engineering Decline",

      description:
        "Review architectural practices and engineering processes to reverse long-term portfolio decline.",

      priority:
        "High",

    });

  }

  /*
  --------------------------------------------------
  Evolution
  --------------------------------------------------
  */

  if (
    input.evolution.summary.overallPortfolioChange > 5
  ) {

    recommendations.push({

      title:
        "Maintain Engineering Momentum",

      description:
        "Continue current engineering practices while scaling successful improvements across all repositories.",

      priority:
        "Medium",

    });

  }

  /*
  --------------------------------------------------
  Default Recommendation
  --------------------------------------------------
  */

  if (
    recommendations.length === 0
  ) {

    recommendations.push({

      title:
        "Continue Current Engineering Strategy",

      description:
        "Portfolio intelligence indicates stable engineering maturity. Continue incremental improvement initiatives.",

      priority:
        "Low",

    });

  }

  return recommendations;

}

function buildExecutiveSummary(
  input: ExecutiveInput,
  portfolioHealth: ExecutivePortfolioHealth,
  findings: ExecutiveFinding[],
): ExecutiveSummary {

  let title =
    "Engineering Portfolio Stable";

  if (
    portfolioHealth.maturity === "Elite"
  ) {

    title =
      "Elite Engineering Portfolio";

  } else if (
    portfolioHealth.maturity === "Advanced"
  ) {

    title =
      "Advanced Engineering Organization";

  } else if (
    portfolioHealth.maturity === "Developing"
  ) {

    title =
      "Engineering Transformation Required";

  } else if (
    portfolioHealth.maturity === "Emerging"
  ) {

    title =
      "Engineering Modernization Required";

  }

  const overview =
    `The portfolio demonstrates ${portfolioHealth.maturity.toLowerCase()} engineering maturity with an executive health score of ${portfolioHealth.score.toFixed(
      1,
    )}% and ${portfolioHealth.confidence.toFixed(
      1,
    )}% confidence.`;

  const criticalFindings =
    findings.filter(
      (finding) =>
        finding.severity === "Critical",
    ).length;

  const highFindings =
    findings.filter(
      (finding) =>
        finding.severity === "High",
    ).length;

  let verdict =
    "Engineering portfolio is operating within acceptable limits.";

  if (
    criticalFindings > 0
  ) {

    verdict =
      "Immediate executive attention is required due to critical engineering risks.";

  } else if (
    highFindings > 0
  ) {

    verdict =
      "Engineering leadership should prioritize the identified high-impact improvement areas.";

  } else if (
    portfolioHealth.maturity === "Elite"
  ) {

    verdict =
      "Engineering portfolio demonstrates industry-leading maturity with strong long-term sustainability.";

  }

  return {

    title,

    overview,

    verdict,

  };

}