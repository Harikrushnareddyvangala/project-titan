import type {
  RepositoryAnalytics,
  RepositoryTrendIntelligence,
} from "@/types/github";

interface RepositoryTrendInput {
  repositories: RepositoryAnalytics[];
}

export function buildRepositoryTrendIntelligence({
  repositories,
}: RepositoryTrendInput): RepositoryTrendIntelligence {

  if (repositories.length === 0) {
    return {
      engineeringTrend: 0,
      securityTrend: 0,
      productionTrend: 0,
      enterpriseTrend: 0,
      hiringTrend: 0,

      overallTrend: 0,

      trendDirection: "Stable",

improvingRepositories: 0,
stableRepositories: 0,
decliningRepositories: 0,

strongestDimension: "N/A",
strongestDimensionScore: 0,

weakestDimension: "N/A",
weakestDimensionScore: 0,

executiveSummary:
  "No repositories are available for trend analysis.",

executiveInsights: [],

recommendations: [],
    };
  }

  const engineeringTrend =
    repositories.reduce(
      (sum, repository) =>
        sum + repository.engineeringStability,
      0,
    ) / repositories.length;

  const securityTrend =
    repositories.reduce(
      (sum, repository) =>
        sum + repository.securityScore,
      0,
    ) / repositories.length;

  const productionTrend =
    repositories.reduce(
      (sum, repository) =>
        sum + repository.releaseReadiness,
      0,
    ) / repositories.length;

  const enterpriseTrend =
    repositories.reduce(
      (sum, repository) =>
        sum + repository.enterpriseReadiness,
      0,
    ) / repositories.length;

  const hiringTrend =
    repositories.reduce(
      (sum, repository) =>
        sum +
        repository.recruiterIntelligence.hiringScore,
      0,
    ) / repositories.length;

  const overallTrend =
    (
      engineeringTrend +
      securityTrend +
      productionTrend +
      enterpriseTrend +
      hiringTrend
    ) / 5;
  const dimensions = [
  {
    name: "Engineering",
    score: engineeringTrend,
  },
  {
    name: "Security",
    score: securityTrend,
  },
  {
    name: "Production",
    score: productionTrend,
  },
  {
    name: "Enterprise",
    score: enterpriseTrend,
  },
  {
    name: "Hiring",
    score: hiringTrend,
  },
];

const strongestDimension = dimensions.reduce(
  (best, current) =>
    current.score > best.score ? current : best,
);

const weakestDimension = dimensions.reduce(
  (worst, current) =>
    current.score < worst.score ? current : worst,
);

  let improvingRepositories = 0;
let stableRepositories = 0;
let decliningRepositories = 0;

repositories.forEach((repository) => {
  const score =
    (
      repository.engineeringStability +
      repository.securityScore +
      repository.productionScore +
      repository.enterpriseReadiness +
      repository.recruiterIntelligence.hiringScore
    ) / 5;

  if (score >= 80) {
    improvingRepositories++;
  } else if (score >= 60) {
    stableRepositories++;
  } else {
    decliningRepositories++;
  }
});

  let trendDirection:
    | "Improving"
    | "Stable"
    | "Declining";

  if (overallTrend >= 80) {
    trendDirection = "Improving";
  } else if (overallTrend >= 60) {
    trendDirection = "Stable";
  } else {
    trendDirection = "Declining";
  }

  let executiveSummary = "";

if (trendDirection === "Improving") {
  executiveSummary =
    "Repository portfolio demonstrates strong engineering maturity with improving overall quality.";
} else if (trendDirection === "Stable") {
  executiveSummary =
    "Repository portfolio is stable with consistent engineering practices across repositories.";
} else {
  executiveSummary =
    "Repository portfolio shows declining engineering quality and requires focused improvements.";
}

  const recommendations: string[] = [];
  const executiveInsights: string[] = [];

  if (engineeringTrend < 70) {
    recommendations.push(
      "Improve engineering stability through testing and code quality improvements.",
    );
  }

  if (securityTrend < 70) {
    recommendations.push(
      "Strengthen repository security practices and dependency management.",
    );
  }

  if (productionTrend < 70) {
    recommendations.push(
      "Increase release readiness through CI/CD and deployment automation.",
    );
  }

  if (enterpriseTrend < 70) {
    recommendations.push(
      "Improve documentation, governance, and enterprise engineering practices.",
    );
  }

  if (hiringTrend < 70) {
    recommendations.push(
      "Improve repository consistency to support onboarding and hiring evaluation.",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Current engineering indicators are healthy. Continue maintaining engineering excellence.",
    );
  }

  executiveInsights.push(
  `${strongestDimension.name} is currently the strongest engineering dimension.`,
);

executiveInsights.push(
  `${weakestDimension.name} requires the greatest improvement across the portfolio.`,
);

if (overallTrend >= 80) {
  executiveInsights.push(
    "Overall repository health is excellent and demonstrates mature engineering practices.",
  );
} else if (overallTrend >= 60) {
  executiveInsights.push(
    "Repository portfolio is healthy with opportunities for targeted improvements.",
  );
} else {
  executiveInsights.push(
    "Repository portfolio requires engineering attention to improve overall quality.",
  );
}

if (engineeringTrend > securityTrend) {
  executiveInsights.push(
    "Engineering maturity currently exceeds security maturity.",
  );
}

if (productionTrend < engineeringTrend) {
  executiveInsights.push(
    "Production readiness is lagging behind engineering maturity.",
  );
}

if (enterpriseTrend >= 80) {
  executiveInsights.push(
    "Repositories demonstrate strong enterprise readiness.",
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

    improvingRepositories,
stableRepositories,
decliningRepositories,

strongestDimension: strongestDimension.name,
strongestDimensionScore: strongestDimension.score,

weakestDimension: weakestDimension.name,
weakestDimensionScore: weakestDimension.score,


executiveSummary,

executiveInsights,

recommendations,
  };
}