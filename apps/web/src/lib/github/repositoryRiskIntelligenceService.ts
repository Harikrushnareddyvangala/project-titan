import type {
  RepositoryForecast,
} from "@/lib/github/repositoryForecastService";

import type {
  RepositoryHistoricalTrend,
} from "@/lib/github/repositoryHistoricalTrendService";
import {

  DEFAULT_RISK_WEIGHTS,

  RISK_THRESHOLDS,

} from "@/constants/risk";

import type {

  RiskCategory,
  RiskPriority,
  RiskSeverity,
  RiskTrend,
  RepositoryRisk,
  RepositoryRiskInput,
  PortfolioRisk,
  RepositoryRiskSummary,
  RiskDistribution,
  ExecutiveRiskInsight,
} from "@/types/risk";

import type {
  RiskLevel,
} from "@/types/intelligence";

export function buildRepositoryRiskIntelligence(

  input: RepositoryRiskInput,

): PortfolioRisk {

  const repositories =
    buildRepositoryRisks(
      input,
    );

  const summary =
    buildPortfolioRiskSummary(
      repositories,
    );

  const distribution =
    buildRiskDistribution(
      repositories,
    );

  const executive =
    buildExecutiveRiskInsight(
      summary,
      repositories,
    );

  return {

    repositories,

    summary,

    distribution,

    executive,

  };

}
function buildRepositoryRisks(

  input: RepositoryRiskInput,

): RepositoryRisk[] {

  return input.forecast.repositories.map(

    (forecastRepository) => {

      const historicalRepository =
        input.historicalTrend.repositories.find(

          (repository) =>

            repository.repositoryName ===
            forecastRepository.repositoryName,

        );

      if (!historicalRepository) {

        throw new Error(

          `Missing historical trend for ${forecastRepository.repositoryName}`,

        );

      }

      return calculateRepositoryRisk(

        forecastRepository,

        historicalRepository,

      );

    },

  );

}
function buildPortfolioRiskSummary(
  repositories: RepositoryRisk[],
): RepositoryRiskSummary {

  if (repositories.length === 0) {

    return {

      overallRisk: "Very Low",

      overallScore: 0,

      confidence: 0,

      repositoryCount: 0,

      highestRiskRepository: "",

      safestRepository: "",

    };

  }

  const overallScore =
    repositories.reduce(
      (sum, repository) =>
        sum + repository.score,
      0,
    ) / repositories.length;

  const confidence =
    repositories.reduce(
      (sum, repository) =>
        sum + repository.confidence,
      0,
    ) / repositories.length;

  const highestRiskRepository =
    [...repositories]
      .sort(
        (a, b) =>
          a.score - b.score,
      )[0].repositoryName;

  const safestRepository =
    [...repositories]
      .sort(
        (a, b) =>
          b.score - a.score,
      )[0].repositoryName;

  return {

    overallRisk:
      determineRiskLevel(
        overallScore,
      ),

    overallScore:
      Number(
        overallScore.toFixed(2),
      ),

    confidence:
      Number(
        confidence.toFixed(2),
      ),

    repositoryCount:
      repositories.length,

    highestRiskRepository,

    safestRepository,

  };

}
function buildRiskDistribution(
  repositories: RepositoryRisk[],
): RiskDistribution {

  return {

    veryLow:
      repositories.filter(
        (repository) =>
          repository.level === "Very Low",
      ).length,

    low:
      repositories.filter(
        (repository) =>
          repository.level === "Low",
      ).length,

    moderate:
      repositories.filter(
        (repository) =>
          repository.level === "Moderate",
      ).length,

    elevated:
      repositories.filter(
        (repository) =>
          repository.level === "Elevated",
      ).length,

    high:
      repositories.filter(
        (repository) =>
          repository.level === "High",
      ).length,

    critical:
      repositories.filter(
        (repository) =>
          repository.level === "Critical",
      ).length,

  };

}
function buildExecutiveRiskInsight(
  summary: RepositoryRiskSummary,
  repositories: RepositoryRisk[],
): ExecutiveRiskInsight {

  let title =
    "Healthy Engineering Portfolio";

  if (
    summary.overallRisk === "Critical"
  ) {

    title =
      "Critical Engineering Risk";

  } else if (
    summary.overallRisk === "High"
  ) {

    title =
      "High Engineering Risk";

  } else if (
    summary.overallRisk === "Elevated"
  ) {

    title =
      "Engineering Risk Increasing";

  }

  const summaryText =
    `Portfolio risk score is ${summary.overallScore.toFixed(
      1,
    )}% across ${summary.repositoryCount} repositories with ${summary.confidence.toFixed(
      1,
    )}% confidence.`;

  let recommendation =
    "Continue current engineering governance and monitoring.";

  if (
    summary.overallRisk === "Critical" ||
    summary.overallRisk === "High"
  ) {

    recommendation =
      `Prioritize remediation for ${summary.highestRiskRepository} and review engineering quality across the portfolio.`;

  }

  return {

    title,

    summary: summaryText,

    recommendation,

  };

}
function calculateRepositoryRisk(
  forecastRepository: RepositoryForecast,
  historicalRepository: RepositoryHistoricalTrend,
): RepositoryRisk {

  const score =
    calculateRiskScore(
      forecastRepository,
      historicalRepository,
    );

  const level =
    determineRiskLevel(
      score,
    );

  const severity =
    determineRiskSeverity(
      level,
    );

  const priority =
    determineRiskPriority(
      level,
    );

  const trend =
    determineRiskTrend(
      historicalRepository.overallGrowth,
    );

  const explanation =
    buildExplanation(
      forecastRepository,
      historicalRepository,
      level,
    );

  const recommendation =
    buildRecommendation(
      level,
    );

  return {

    repositoryName:
      forecastRepository.repositoryName,

    category:
      "Engineering",

    level,

    severity,

    priority,

    trend,

    score,

    confidence:
      forecastRepository.forecastConfidence,

    explanation,

    recommendation,

  };

}
function calculateRiskScore(
  forecastRepository: RepositoryForecast,
  historicalRepository: RepositoryHistoricalTrend,
): number {

  const weightedScore =

    forecastRepository.predictedEngineeringScore *
      DEFAULT_RISK_WEIGHTS.engineering +

    forecastRepository.predictedSecurityScore *
      DEFAULT_RISK_WEIGHTS.security +

    forecastRepository.predictedProductionScore *
      DEFAULT_RISK_WEIGHTS.production +

    forecastRepository.predictedEnterpriseScore *
      DEFAULT_RISK_WEIGHTS.enterprise +

    forecastRepository.predictedHiringScore *
      DEFAULT_RISK_WEIGHTS.hiring +

    historicalRepository.stabilityIndex *
      DEFAULT_RISK_WEIGHTS.stability +

    forecastRepository.forecastConfidence *
      DEFAULT_RISK_WEIGHTS.confidence;

  return Number(
    weightedScore.toFixed(2),
  );

}
function determineRiskLevel(
  score: number,
): RiskLevel {

  if (score >= RISK_THRESHOLDS.veryLow)
    return "Very Low";

  if (score >= RISK_THRESHOLDS.low)
    return "Low";

  if (score >= RISK_THRESHOLDS.moderate)
    return "Moderate";

  if (score >= RISK_THRESHOLDS.elevated)
    return "Elevated";

  if (score >= RISK_THRESHOLDS.high)
    return "High";

  return "Critical";

}
function determineRiskSeverity(
  level: RiskLevel,
): RiskSeverity {

  switch (level) {

    case "Very Low":
    case "Low":
      return "Info";

    case "Moderate":
    case "Elevated":
      return "Warning";

    case "High":
      return "Severe";

    case "Critical":
      return "Critical";

  }

}
function determineRiskPriority(
  level: RiskLevel,
): RiskPriority {

  switch (level) {

    case "Very Low":
    case "Low":
      return "Low";

    case "Moderate":
      return "Medium";

    case "Elevated":
    case "High":
      return "High";

    case "Critical":
      return "Critical";

  }

}
function determineRiskTrend(
  growth: number,
): RiskTrend {

  if (growth >= 8)
    return "Rapidly Improving";

  if (growth >= 3)
    return "Improving";

  if (growth >= -2)
    return "Stable";

  if (growth >= -8)
    return "Worsening";

  return "Rapidly Worsening";

}
function buildExplanation(
  forecastRepository: RepositoryForecast,
  historicalRepository: RepositoryHistoricalTrend,
  level: RiskLevel,
): string {

  return [
    `Overall risk classified as ${level}.`,
    `Predicted engineering score is ${forecastRepository.predictedEngineeringScore.toFixed(1)}%.`,
    `Historical stability index is ${historicalRepository.stabilityIndex.toFixed(1)}%.`,
    `Forecast confidence is ${forecastRepository.forecastConfidence.toFixed(1)}%.`,
  ].join(" ");

}
function buildRecommendation(
  level: RiskLevel,
): string {

  switch (level) {

    case "Very Low":
      return "Continue current engineering practices and monitor trends.";

    case "Low":
      return "Maintain quality standards and review periodically.";

    case "Moderate":
      return "Monitor engineering quality and address emerging weaknesses.";

    case "Elevated":
      return "Prioritize engineering improvements and strengthen testing.";

    case "High":
      return "Plan focused remediation on engineering quality, security, and production readiness.";

    case "Critical":
      return "Immediate engineering intervention recommended to reduce operational risk.";

  }

}