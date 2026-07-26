import type {
  RepositoryAnalytics,
  RepositoryComparison,
  ComparedRepository,
} from "@/types/github";

export function buildRepositoryComparison(
  repositories: RepositoryAnalytics[],
): RepositoryComparison {

  const compared: ComparedRepository[] =
    repositories.map((repository) => ({

      name: repository.repositoryName,

      engineeringScore:
        repository.engineeringScore,

      securityScore:
        repository.securityScore,

      productionScore:
        repository.productionScore,

      enterpriseReadiness:
        repository.enterpriseReadiness,

      hiringScore:
        repository.recruiterIntelligence.hiringScore,

      repositoryGrade:
        repository.repositoryGrade,

    }));

  const strongest =
    [...repositories].sort(
      (a, b) =>
        b.engineeringScore -
        a.engineeringScore,
    )[0];

  const weakest =
    [...repositories].sort(
      (a, b) =>
        a.engineeringScore -
        b.engineeringScore,
    )[0];

  const averageEngineeringScore =
    repositories.reduce(
      (sum, repository) =>
        sum + repository.engineeringScore,
      0,
    ) / repositories.length;

  const averageSecurityScore =
    repositories.reduce(
      (sum, repository) =>
        sum + repository.securityScore,
      0,
    ) / repositories.length;

  const averageEnterpriseReadiness =
    repositories.reduce(
      (sum, repository) =>
        sum + repository.enterpriseReadiness,
      0,
    ) / repositories.length;

  return {

    repositories: compared,

    strongestRepository:
      strongest.repositoryName,

    weakestRepository:
      weakest.repositoryName,

    averageEngineeringScore,

    averageSecurityScore,

    averageEnterpriseReadiness,

    executiveSummary:
      `${strongest.repositoryName} demonstrates the strongest engineering maturity while ${weakest.repositoryName} presents the greatest opportunity for improvement.`,

  };

}