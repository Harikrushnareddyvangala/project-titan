import type { RepositoryAnalytics } from "@/types/github";

export interface PortfolioAnalytics {
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  totalLanguages: number;

  averageEngineeringScore: number;
  averageProductionScore: number;
  averageHealthScore: number;

  strongestRepository: string;
  weakestRepository: string;

  portfolioGrade: string;

  enterpriseReadiness: number;

  totalRecommendations: number;
}

export function buildPortfolioAnalytics(
  repositories: RepositoryAnalytics[],
): PortfolioAnalytics {

  if (repositories.length === 0) {
    return {
      totalRepositories: 0,
      totalStars: 0,
      totalForks: 0,
      totalLanguages: 0,
      averageEngineeringScore: 0,
      averageProductionScore: 0,
      averageHealthScore: 0,
      strongestRepository: "",
      weakestRepository: "",
      portfolioGrade: "N/A",
      enterpriseReadiness: 0,
      totalRecommendations: 0,
    };
  }

  const totalRepositories = repositories.length;

  const totalStars = repositories.reduce(
    (sum, repo) => sum + (repo.stars ?? 0),
    0,
  );

  const totalForks = repositories.reduce(
    (sum, repo) => sum + (repo.forks ?? 0),
    0,
  );

  const totalLanguages = repositories.reduce(
    (sum, repo) => sum + (repo.languageCount ?? 0),
    0,
  );

  const averageEngineeringScore = Math.round(
    repositories.reduce(
      (sum, repo) => sum + (repo.engineeringScore ?? 0),
      0,
    ) / totalRepositories,
  );

  const averageProductionScore = Math.round(
    repositories.reduce(
      (sum, repo) => sum + (repo.productionScore ?? 0),
      0,
    ) / totalRepositories,
  );

  const averageHealthScore = Math.round(
    repositories.reduce(
      (sum, repo) => sum + (repo.healthScore ?? 0),
      0,
    ) / totalRepositories,
  );

  const strongest = repositories.reduce((best, current) =>
    current.engineeringScore > best.engineeringScore
      ? current
      : best,
  );

  const weakest = repositories.reduce((worst, current) =>
    current.engineeringScore < worst.engineeringScore
      ? current
      : worst,
  );

  const enterpriseReadiness = Math.round(
    averageEngineeringScore * 0.4 +
      averageProductionScore * 0.4 +
      averageHealthScore * 0.2,
  );

  let portfolioGrade = "C";

  if (enterpriseReadiness >= 95) {
    portfolioGrade = "A+";
  } else if (enterpriseReadiness >= 90) {
    portfolioGrade = "A";
  } else if (enterpriseReadiness >= 85) {
    portfolioGrade = "B+";
  } else if (enterpriseReadiness >= 75) {
    portfolioGrade = "B";
  } else if (enterpriseReadiness >= 65) {
    portfolioGrade = "C+";
  }

  const totalRecommendations = repositories.reduce(
    (sum, repo) =>
      sum + (repo.recommendations?.length ?? 0),
    0,
  );

  return {
    totalRepositories,
    totalStars,
    totalForks,
    totalLanguages,

    averageEngineeringScore,
    averageProductionScore,
    averageHealthScore,

    strongestRepository:
      strongest.repositoryName ?? "",

    weakestRepository:
      weakest.repositoryName ?? "",

    portfolioGrade,

    enterpriseReadiness,

    totalRecommendations,
  };
}