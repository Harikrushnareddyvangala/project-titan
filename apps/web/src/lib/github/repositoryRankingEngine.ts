import type {
  RankedRepository,
  RepositoryAnalytics,
} from "@/types/github";

function calculateOverallScore(
  repository: RepositoryAnalytics,
): number {
  const score =
    repository.engineeringScore * 0.30 +
    repository.securityScore * 0.20 +
    repository.productionScore * 0.20 +
    repository.enterpriseReadiness * 0.20 +
    repository.recruiterIntelligence.hiringScore * 0.10;

  return Number(score.toFixed(2));
}

function getMedal(
  rank: number,
): RankedRepository["medal"] {
  switch (rank) {
    case 1:
      return "🥇";

    case 2:
      return "🥈";

    case 3:
      return "🥉";

    default:
      return "";
  }
}

export function buildRepositoryRanking(
  repositories: RepositoryAnalytics[],
): RankedRepository[] {

  const ranked = repositories
    .map((repository) => ({

      repositoryName:
        repository.repositoryName,

      overallScore:
        calculateOverallScore(
          repository,
        ),

      engineeringScore:
        repository.engineeringScore,

      securityScore:
        repository.securityScore,

      productionScore:
        repository.productionScore,

      enterpriseReadiness:
        repository.enterpriseReadiness,

      hiringScore:
        repository.recruiterIntelligence
          .hiringScore,

      repositoryGrade:
        repository.repositoryGrade,

    }))
    .sort(
      (a, b) =>
        b.overallScore -
        a.overallScore,
    );

  return ranked.map(
    (repository, index) => ({

      ...repository,

      rank: index + 1,

      medal: getMedal(
        index + 1,
      ),

    }),
  );
}