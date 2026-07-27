import type { RankedRepository } from "@/types/github";

export type ComparisonCategory =
  | "engineering"
  | "security"
  | "production"
  | "enterprise"
  | "hiring";

export interface CategoryLeader {
  category: ComparisonCategory;
  repository: RankedRepository;
  score: number;
}

export interface CategoryLaggard {
  category: ComparisonCategory;
  repository: RankedRepository;
  score: number;
}

export interface RepositoryGap {
  repository: RankedRepository;
  strongestCategory: ComparisonCategory;
  weakestCategory: ComparisonCategory;
  difference: number;
}

export interface MetricGap {
  category: ComparisonCategory;
  highestRepository: RankedRepository;
  lowestRepository: RankedRepository;
  gap: number;
}

export interface ExecutiveObservation {
  title: string;
  description: string;
  severity: "success" | "info" | "warning";
}

export interface ComparativeAnalytics {
  categoryLeaders: CategoryLeader[];
  categoryLaggards: CategoryLaggard[];

  strongestRepository: RankedRepository;
  weakestRepository: RankedRepository;

  mostBalancedRepository: RankedRepository;

  repositoryGaps: RepositoryGap[];

  metricGaps: MetricGap[];

  executiveObservations: ExecutiveObservation[];
}

export class ComparativeAnalyticsEngine {
  static analyze(
    repositories: RankedRepository[],
  ): ComparativeAnalytics {
    if (repositories.length === 0) {
      throw new Error(
        "ComparativeAnalyticsEngine requires at least one repository.",
      );
    }

    return {
      categoryLeaders:
        this.findCategoryLeaders(repositories),

      categoryLaggards:
        this.findCategoryLaggards(repositories),

      strongestRepository:
        this.findStrongestRepository(repositories),

      weakestRepository:
        this.findWeakestRepository(repositories),

      mostBalancedRepository:
        this.findMostBalancedRepository(repositories),

      repositoryGaps:
        this.calculateRepositoryGaps(repositories),

      metricGaps:
        this.calculateMetricGaps(repositories),

      executiveObservations:
        this.generateExecutiveObservations(repositories),
    };
  }

  // ==========================================================
  // CATEGORY LEADERS
  // ==========================================================

  private static findCategoryLeaders(
    repositories: RankedRepository[],
  ): CategoryLeader[] {
    return [
      this.buildLeader(
        repositories,
        "engineering",
        (r) => r.engineeringScore,
      ),

      this.buildLeader(
        repositories,
        "security",
        (r) => r.securityScore,
      ),

      this.buildLeader(
        repositories,
        "production",
        (r) => r.productionScore,
      ),

      this.buildLeader(
        repositories,
        "enterprise",
        (r) => r.enterpriseReadiness,
      ),

      this.buildLeader(
        repositories,
        "hiring",
        (r) => r.hiringScore,
      ),
    ];
  }

  private static buildLeader(
    repositories: RankedRepository[],
    category: ComparisonCategory,
    selector: (repo: RankedRepository) => number,
  ): CategoryLeader {
    const repository = repositories.reduce((best, current) =>
      selector(current) > selector(best)
        ? current
        : best,
    );

    return {
      category,
      repository,
      score: selector(repository),
    };
  }

  // ==========================================================
  // CATEGORY LAGGARDS
  // ==========================================================

  private static findCategoryLaggards(
    repositories: RankedRepository[],
  ): CategoryLaggard[] {
    return [
      this.buildLaggard(
        repositories,
        "engineering",
        (r) => r.engineeringScore,
      ),

      this.buildLaggard(
        repositories,
        "security",
        (r) => r.securityScore,
      ),

      this.buildLaggard(
        repositories,
        "production",
        (r) => r.productionScore,
      ),

      this.buildLaggard(
        repositories,
        "enterprise",
        (r) => r.enterpriseReadiness,
      ),

      this.buildLaggard(
        repositories,
        "hiring",
        (r) => r.hiringScore,
      ),
    ];
  }

  private static buildLaggard(
    repositories: RankedRepository[],
    category: ComparisonCategory,
    selector: (repo: RankedRepository) => number,
  ): CategoryLaggard {
    const repository = repositories.reduce((worst, current) =>
      selector(current) < selector(worst)
        ? current
        : worst,
    );

    return {
      category,
      repository,
      score: selector(repository),
    };
  }

  // ==========================================================
  // OVERALL LEADERS
  // ==========================================================

  private static findStrongestRepository(
    repositories: RankedRepository[],
  ): RankedRepository {
    return repositories.reduce((best, current) =>
      current.overallScore > best.overallScore
        ? current
        : best,
    );
  }

  private static findWeakestRepository(
    repositories: RankedRepository[],
  ): RankedRepository {
    return repositories.reduce((worst, current) =>
      current.overallScore < worst.overallScore
        ? current
        : worst,
    );
  }
  // ==========================================================
// REPOSITORY BALANCE ANALYSIS
// ==========================================================

private static findMostBalancedRepository(
  repositories: RankedRepository[],
): RankedRepository {
  return repositories.reduce((best, current) => {
    const currentVariance =
      this.calculateMetricVariance(current);

    const bestVariance =
      this.calculateMetricVariance(best);

    return currentVariance < bestVariance
      ? current
      : best;
  });
}

private static calculateMetricVariance(
  repository: RankedRepository,
): number {
  const metrics = [
    repository.engineeringScore,
    repository.securityScore,
    repository.productionScore,
    repository.enterpriseReadiness,
    repository.hiringScore,
  ];

  const mean =
    metrics.reduce((sum, value) => sum + value, 0) /
    metrics.length;

  return (
    metrics.reduce(
      (sum, value) =>
        sum + Math.pow(value - mean, 2),
      0,
    ) / metrics.length
  );
}
// ==========================================================
// REPOSITORY GAP ANALYSIS
// ==========================================================

private static calculateRepositoryGaps(
  repositories: RankedRepository[],
): RepositoryGap[] {
  return repositories.map((repository) => {
    const metrics = [
      {
        category: "engineering" as const,
        score: repository.engineeringScore,
      },
      {
        category: "security" as const,
        score: repository.securityScore,
      },
      {
        category: "production" as const,
        score: repository.productionScore,
      },
      {
        category: "enterprise" as const,
        score: repository.enterpriseReadiness,
      },
      {
        category: "hiring" as const,
        score: repository.hiringScore,
      },
    ];

    const strongest =
      metrics.reduce((best, current) =>
        current.score > best.score
          ? current
          : best,
      );

    const weakest =
      metrics.reduce((worst, current) =>
        current.score < worst.score
          ? current
          : worst,
      );

    return {
      repository,
      strongestCategory:
        strongest.category,

      weakestCategory:
        weakest.category,

      difference:
        strongest.score - weakest.score,
    };
  });
}
// ==========================================================
// METRIC GAP ANALYSIS
// ==========================================================

private static calculateMetricGaps(
  repositories: RankedRepository[],
): MetricGap[] {
  return [
    this.metricGap(
      repositories,
      "engineering",
      (r) => r.engineeringScore,
    ),

    this.metricGap(
      repositories,
      "security",
      (r) => r.securityScore,
    ),

    this.metricGap(
      repositories,
      "production",
      (r) => r.productionScore,
    ),

    this.metricGap(
      repositories,
      "enterprise",
      (r) => r.enterpriseReadiness,
    ),

    this.metricGap(
      repositories,
      "hiring",
      (r) => r.hiringScore,
    ),
  ];
}

private static metricGap(
  repositories: RankedRepository[],
  category: ComparisonCategory,
  selector: (repo: RankedRepository) => number,
): MetricGap {
  const highest =
    repositories.reduce((best, current) =>
      selector(current) > selector(best)
        ? current
        : best,
    );

  const lowest =
    repositories.reduce((worst, current) =>
      selector(current) < selector(worst)
        ? current
        : worst,
    );

  return {
    category,

    highestRepository: highest,

    lowestRepository: lowest,

    gap:
      selector(highest) -
      selector(lowest),
  };
}
// ==========================================================
// EXECUTIVE OBSERVATIONS
// ==========================================================

private static generateExecutiveObservations(
  repositories: RankedRepository[],
): ExecutiveObservation[] {
  const observations: ExecutiveObservation[] = [];

  const strongest =
    this.findStrongestRepository(repositories);

  observations.push({
    title: "Portfolio Leader",
    severity: "success",
    description: `${strongest.repositoryName} leads the portfolio with an overall engineering score of ${strongest.overallScore.toFixed(
      1,
    )}.`,
  });

  const weakest =
    this.findWeakestRepository(repositories);

  observations.push({
    title: "Improvement Opportunity",
    severity: "warning",
    description: `${weakest.repositoryName} has the lowest overall score and should be prioritized for engineering improvements.`,
  });

  const balanced =
    this.findMostBalancedRepository(repositories);

  observations.push({
    title: "Most Balanced Repository",
    severity: "info",
    description: `${balanced.repositoryName} demonstrates the most consistent engineering maturity across all evaluation categories.`,
  });

  this.calculateMetricGaps(repositories).forEach(
    (gap) => {
      if (gap.gap >= 20) {
        observations.push({
          title: `${this.formatCategory(
            gap.category,
          )} Gap`,
          severity: "warning",
          description: `${this.formatCategory(
            gap.category,
          )} shows a ${gap.gap.toFixed(
            1,
          )}-point spread across repositories, indicating inconsistent engineering practices.`,
        });
      }
    },
  );

  this.calculateRepositoryGaps(repositories).forEach(
    (gap) => {
      if (gap.difference >= 20) {
        observations.push({
          title: `${gap.repository.repositoryName} Profile`,
          severity: "info",
          description: `${gap.repository.repositoryName} performs strongly in ${this.formatCategory(
            gap.strongestCategory,
          )} but has significant room for improvement in ${this.formatCategory(
            gap.weakestCategory,
          )}.`,
        });
      }
    },
  );

  return observations;
}
// ==========================================================
// UTILITIES
// ==========================================================

private static formatCategory(
  category: ComparisonCategory,
): string {
  switch (category) {
    case "engineering":
      return "Engineering";

    case "security":
      return "Security";

    case "production":
      return "Production";

    case "enterprise":
      return "Enterprise Readiness";

    case "hiring":
      return "Hiring";

    default:
      return category;
  }
}
}