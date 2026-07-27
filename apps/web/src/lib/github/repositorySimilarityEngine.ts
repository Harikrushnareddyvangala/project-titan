import type {
  RepositoryAnalytics,
  RepositorySimilarity,
  RepositorySimilarityAnalysis,
} from "@/types/github";

function similarity(scoreA: number, scoreB: number): number {
  return Math.max(0, 100 - Math.abs(scoreA - scoreB));
}

function calculateTechnologySimilarity(
  repositoryA: RepositoryAnalytics,
  repositoryB: RepositoryAnalytics,
): number {
  const technologies = [
  [repositoryA.frontend, repositoryB.frontend],
  [repositoryA.backend, repositoryB.backend],
  [repositoryA.database, repositoryB.database],
  [repositoryA.aiFramework, repositoryB.aiFramework],
  [repositoryA.vectorDatabase, repositoryB.vectorDatabase],
  [repositoryA.cloud, repositoryB.cloud],
  [repositoryA.packageManager, repositoryB.packageManager],
  [repositoryA.frontendFramework, repositoryB.frontendFramework],
  [repositoryA.backendFramework, repositoryB.backendFramework],
  [repositoryA.aiLibrary, repositoryB.aiLibrary],
  [repositoryA.technologyMaturity, repositoryB.technologyMaturity],
];

const comparisons = technologies.filter(
  ([left, right]) => left && right,
);

if (comparisons.length === 0) {
  return 0;
}

const matches = comparisons.filter(
  ([left, right]) => left === right,
).length;

return Number(
  ((matches / comparisons.length) * 100).toFixed(1),
);
}

function classifyRelationship(
  similarityScore: number,
): RepositorySimilarity["relationship"] {
  if (similarityScore >= 95) {
    return "Nearly Identical";
  }

  if (similarityScore >= 85) {
    return "Highly Similar";
  }

  if (similarityScore >= 70) {
    return "Moderately Similar";
  }

  if (similarityScore >= 50) {
    return "Different";
  }

  return "Very Different";
}

function calculateOverallSimilarity(
  engineering: number,
  security: number,
  production: number,
  enterprise: number,
  hiring: number,
  technology: number,
): number {
  return (
    engineering * 0.25 +
    security * 0.15 +
    production * 0.20 +
    enterprise * 0.15 +
    hiring * 0.15 +
    technology * 0.10
  );
}

export function buildRepositorySimilarity(
  repositories: RepositoryAnalytics[],
): RepositorySimilarityAnalysis {
  const similarities: RepositorySimilarity[] = [];

  for (let i = 0; i < repositories.length; i++) {
    for (
      let j = i + 1;
      j < repositories.length;
      j++
    ) {
      const repositoryA = repositories[i];
      const repositoryB = repositories[j];

      const engineeringSimilarity =
        similarity(
          repositoryA.engineeringScore,
          repositoryB.engineeringScore,
        );

      const securitySimilarity =
        similarity(
          repositoryA.securityScore,
          repositoryB.securityScore,
        );

      const productionSimilarity =
        similarity(
          repositoryA.productionScore,
          repositoryB.productionScore,
        );

      const enterpriseSimilarity =
        similarity(
          repositoryA.enterpriseReadiness,
          repositoryB.enterpriseReadiness,
        );

      const hiringSimilarity =
        similarity(
          repositoryA.recruiterIntelligence.hiringScore,
          repositoryB.recruiterIntelligence.hiringScore,
        );

      const technologySimilarity =
  calculateTechnologySimilarity(
    repositoryA,
    repositoryB,
  );

      const overallSimilarity = Number(
        calculateOverallSimilarity(
          engineeringSimilarity,
          securitySimilarity,
          productionSimilarity,
          enterpriseSimilarity,
          hiringSimilarity,
          technologySimilarity,
        ).toFixed(1)
        );

      similarities.push({
        repositoryA:
          repositoryA.repositoryName,

        repositoryB:
          repositoryB.repositoryName,

        engineeringSimilarity,

        securitySimilarity,

        productionSimilarity,

        enterpriseSimilarity,

        hiringSimilarity,

        technologySimilarity,

        overallSimilarity,

        relationship:
          classifyRelationship(
            overallSimilarity,
          ),
      });
    }
  }

  const sorted = [...similarities].sort((a, b) => {
  if (b.overallSimilarity !== a.overallSimilarity) {
    return b.overallSimilarity - a.overallSimilarity;
  }

  return (
    `${a.repositoryA}-${a.repositoryB}`.localeCompare(
      `${b.repositoryA}-${b.repositoryB}`,
    )
  );
});

  const averageSimilarity =
    similarities.length === 0
      ? 0
      : similarities.reduce(
          (sum, similarity) =>
            sum +
            similarity.overallSimilarity,
          0,
        ) / similarities.length;

  return {
    similarities: sorted,

    closestRepositories:
      sorted.slice(0, 5),

    mostDifferentRepositories:
      [...sorted].reverse().slice(0, 5),

    averageSimilarity,
  };
}