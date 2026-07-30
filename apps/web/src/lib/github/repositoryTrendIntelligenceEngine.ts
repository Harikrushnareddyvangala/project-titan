import type {
  RepositoryAnalytics,
  RepositoryTrendIntelligence,
} from "@/types/github";

interface RepositoryTrendSnapshot {
  timestamp: Date;
  repositories: RepositoryAnalytics[];
}

interface RepositoryTrendInput {
  current: RepositoryTrendSnapshot;
  previous?: RepositoryTrendSnapshot;
}

export function buildRepositoryTrendIntelligence({
  current,
  previous,
}: RepositoryTrendInput): RepositoryTrendIntelligence {
  if (!previous) {
    return {
      engineeringTrend: 0,
      securityTrend: 0,
      productionTrend: 0,
      enterpriseTrend: 0,
      hiringTrend: 0,

      overallTrend: 0,

      trendDirection: "Stable",

      recommendations: [
        "Historical trend analysis will become available after multiple repository snapshots have been collected.",
      ],
    };
  }

  const engineeringTrend =
    current.repositories.reduce(
      (sum, repository, index) =>
        sum +
        (
          repository.engineeringScore -
          previous.repositories[index].engineeringScore
        ),
      0,
    ) / current.repositories.length;

  const securityTrend =
    current.repositories.reduce(
      (sum, repository, index) =>
        sum +
        (
          repository.securityScore -
          previous.repositories[index].securityScore
        ),
      0,
    ) / current.repositories.length;

  const productionTrend =
    current.repositories.reduce(
      (sum, repository, index) =>
        sum +
        (
          repository.productionScore -
          previous.repositories[index].productionScore
        ),
      0,
    ) / current.repositories.length;

  const enterpriseTrend =
    current.repositories.reduce(
      (sum, repository, index) =>
        sum +
        (
          repository.enterpriseReadiness -
          previous.repositories[index].enterpriseReadiness
        ),
      0,
    ) / current.repositories.length;

  const hiringTrend =
    current.repositories.reduce(
      (sum, repository, index) =>
        sum +
        (
          repository.recruiterIntelligence.hiringScore -
          previous.repositories[index].recruiterIntelligence.hiringScore
        ),
      0,
    ) / current.repositories.length;

  const overallTrend =
    (
      engineeringTrend +
      securityTrend +
      productionTrend +
      enterpriseTrend +
      hiringTrend
    ) / 5;

  let trendDirection: "Improving" | "Stable" | "Declining";

  if (overallTrend > 5) {
    trendDirection = "Improving";
  } else if (overallTrend < -5) {
    trendDirection = "Declining";
  } else {
    trendDirection = "Stable";
  }

  const recommendations: string[] = [];

  if (trendDirection === "Improving") {
    recommendations.push(
      "Repository quality is improving across the portfolio. Continue current engineering practices.",
    );
  }

  if (trendDirection === "Stable") {
    recommendations.push(
      "Repository quality is stable. Continue monitoring long-term engineering trends.",
    );
  }

  if (trendDirection === "Declining") {
    recommendations.push(
      "Repository quality is declining. Investigate engineering, security, and operational metrics to identify regression causes.",
    );
  }

  return {
    engineeringTrend,
    securityTrend,
    productionTrend,
    enterpriseTrend,
    hiringTrend,

    overallTrend,

    trendDirection,

    recommendations,
  };
}