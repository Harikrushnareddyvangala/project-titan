import type {
  RepositoryAnalytics,
  PortfolioAnalytics,
} from "@/types/github";

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

      averageHealthScore: 0,

      averageProductionScore: 0,

      strongestRepository: "",

      weakestRepository: "",

      enterpriseReadiness: 0,

      portfolioGrade: "N/A",

      totalRecommendations: 0,

    };

  }

  const totalRepositories =
    repositories.length;

  const totalStars =
    repositories.reduce(
      (sum, repo) => sum + repo.stars,
      0,
    );

  const totalForks =
    repositories.reduce(
      (sum, repo) => sum + repo.forks,
      0,
    );

  const totalLanguages =
    repositories.reduce(
      (sum, repo) =>
        sum + repo.languageCount,
      0,
    );

  const averageEngineeringScore =
    Math.round(

      repositories.reduce(

        (sum, repo) =>
          sum + repo.engineeringScore,

        0,

      ) / totalRepositories,

    );

  const averageHealthScore =
    Math.round(

      repositories.reduce(

        (sum, repo) =>
          sum + repo.healthScore,

        0,

      ) / totalRepositories,

    );

  const averageProductionScore =
    Math.round(

      repositories.reduce(

        (sum, repo) =>
          sum + repo.productionScore,

        0,

      ) / totalRepositories,

    );

  const strongestRepository =
    repositories.reduce(

      (best, current) =>

        current.engineeringScore >
        best.engineeringScore

          ? current

          : best,

    );

  const weakestRepository =
    repositories.reduce(

      (worst, current) =>

        current.engineeringScore <
        worst.engineeringScore

          ? current

          : worst,

    );

  const enterpriseReadiness =
    Math.round(

      averageEngineeringScore * 0.4 +

      averageHealthScore * 0.3 +

      averageProductionScore * 0.3,

    );

  let portfolioGrade = "C";

  if (enterpriseReadiness >= 95)
    portfolioGrade = "A+";

  else if (enterpriseReadiness >= 90)
    portfolioGrade = "A";

  else if (enterpriseReadiness >= 80)
    portfolioGrade = "B+";

  else if (enterpriseReadiness >= 70)
    portfolioGrade = "B";

  else if (enterpriseReadiness >= 60)
    portfolioGrade = "C+";

  const totalRecommendations =
    repositories.reduce(

      (sum, repo) =>

        sum +
        repo.recommendations.length,

      0,

    );

  return {

    totalRepositories,

    totalStars,

    totalForks,

    totalLanguages,

    averageEngineeringScore,

    averageHealthScore,

    averageProductionScore,

    strongestRepository:
      strongestRepository.repositoryName,

    weakestRepository:
      weakestRepository.repositoryName,

    enterpriseReadiness,

    portfolioGrade,

    totalRecommendations,

  };

}