import type {
  ComparedRepository,
  Recommendation,
  RepositoryAnalytics,
  RepositoryComparison,
} from "@/types/github";

import { buildRepositoryRanking } from "./repositoryRankingEngine";
import { buildRepositoryTechnologyAnalysis } from "./repositoryTechnologyEngine";
import { buildPortfolioHealth } from "./portfolioHealthEngine";
import { buildPortfolioInsights } from "./portfolioInsightsEngine";
import { buildArchitectureIntelligence } from "./architectureIntelligenceEngine";
import { buildProductivityIntelligence } from "./productivityIntelligenceEngine";
import { buildRepositoryRiskIntelligence } from "./repositoryRiskIntelligenceEngine";
export function buildRepositoryComparison(
  repositories: RepositoryAnalytics[],
): RepositoryComparison {


  if (repositories.length === 0) {
  const portfolioHealth = buildPortfolioHealth({
    repositories: [],
  });

  return {
    repositories: [],

    rankings: [],

    strongestRepository: "",
    weakestRepository: "",

    engineeringLeader: "",
    securityLeader: "",
    productionLeader: "",
    enterpriseLeader: "",
    hiringLeader: "",

    averageEngineeringScore: 0,
    averageSecurityScore: 0,
    averageEnterpriseReadiness: 0,
    averageHiringScore: 0,

    highestRepositoryGrade: "",

    comparisonStrengths: [],
    comparisonRisks: [],
    comparisonRecommendations: [],

    executiveSummary: "No repositories available for comparison.",
    executiveVerdict: "Repository comparison unavailable.",

    technologyAnalysis:
      buildRepositoryTechnologyAnalysis([]),

    portfolioHealth,

    portfolioInsights:
      buildPortfolioInsights({
        repositories: [],
        portfolioHealth,
      }),

    architectureIntelligence:
      buildArchitectureIntelligence({
        repositories: [],
      }),

    productivityIntelligence:
      buildProductivityIntelligence({
        repositories: [],
      }),
    repositoryRiskIntelligence:
  buildRepositoryRiskIntelligence({
    repositories: [],
  }),
  };
}
   
  const rankings = buildRepositoryRanking(
    repositories,
  );

  const compared: ComparedRepository[] = repositories.map(
    (repository) => ({
      name: repository.repositoryName,

      engineeringScore: repository.engineeringScore,

      securityScore: repository.securityScore,

      productionScore: repository.productionScore,

      enterpriseReadiness:
        repository.enterpriseReadiness,

      hiringScore:
        repository.recruiterIntelligence.hiringScore,

      repositoryGrade:
        repository.repositoryGrade,
    }),
  );

  const engineeringLeader = [...repositories].sort(
    (a, b) =>
      b.engineeringScore -
      a.engineeringScore,
  )[0];

  const weakestEngineering = [...repositories].sort(
    (a, b) =>
      a.engineeringScore -
      b.engineeringScore,
  )[0];

  const securityLeader = [...repositories].sort(
    (a, b) =>
      b.securityScore -
      a.securityScore,
  )[0];

  const productionLeader = [...repositories].sort(
    (a, b) =>
      b.productionScore -
      a.productionScore,
  )[0];

  const enterpriseLeader = [...repositories].sort(
    (a, b) =>
      b.enterpriseReadiness -
      a.enterpriseReadiness,
  )[0];

  const hiringLeader = [...repositories].sort(
    (a, b) =>
      b.recruiterIntelligence.hiringScore -
      a.recruiterIntelligence.hiringScore,
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

  const averageHiringScore =
    repositories.reduce(
      (sum, repository) =>
        sum +
        repository.recruiterIntelligence.hiringScore,
      0,
    ) / repositories.length;

  const highestRepositoryGrade =
    [...repositories].sort(
      (a, b) =>
        b.engineeringScore -
        a.engineeringScore,
    )[0].repositoryGrade;

  const comparisonStrengths = [
    ...new Set(
      repositories.flatMap(
        (repository) =>
          repository.strengths,
      ),
    ),
  ];

  const comparisonRisks = [
    ...new Set(
      repositories.flatMap(
        (repository) =>
          repository.risks,
      ),
    ),
  ];

  const comparisonRecommendations = Array.from(
  new Map(
    repositories
      .flatMap((repository) => repository.recommendations)
      .map((recommendation) => [
        `${recommendation.title}:${recommendation.description}`,
        recommendation,
      ]),
  ).values(),
);
  const executiveSummary =
    `${engineeringLeader.repositoryName} demonstrates the strongest engineering maturity while ${weakestEngineering.repositoryName} presents the greatest opportunity for improvement.`;

  const executiveVerdict =
    `Across ${repositories.length} repositories, the portfolio averages ${averageEngineeringScore.toFixed(
      1,
    )}% engineering maturity, ${averageSecurityScore.toFixed(
      1,
    )}% security readiness, and ${averageEnterpriseReadiness.toFixed(
      1,
    )}% enterprise readiness. ${engineeringLeader.repositoryName} currently leads the comparison.`;
    const technologyAnalysis =
  buildRepositoryTechnologyAnalysis(
    repositories,
  );
    const portfolioHealth =
  buildPortfolioHealth({
    repositories,
  });
  const portfolioInsights =
  buildPortfolioInsights({
    repositories,
    portfolioHealth,
  });
const architectureIntelligence =
  buildArchitectureIntelligence({
    repositories,
  });
  const productivityIntelligence =
  buildProductivityIntelligence({
    repositories,
  });
  const repositoryRiskIntelligence =
  buildRepositoryRiskIntelligence({
    repositories,
  });

  return {

  repositories: compared,

  rankings,

  strongestRepository:
    engineeringLeader.repositoryName,

  weakestRepository:
    weakestEngineering.repositoryName,

  engineeringLeader:
    engineeringLeader.repositoryName,

  securityLeader:
    securityLeader.repositoryName,

  productionLeader:
    productionLeader.repositoryName,

  enterpriseLeader:
    enterpriseLeader.repositoryName,

  hiringLeader:
    hiringLeader.repositoryName,

  averageEngineeringScore,

  averageSecurityScore,

  averageEnterpriseReadiness,

  averageHiringScore,

  highestRepositoryGrade,

  comparisonStrengths,

  comparisonRisks,

  comparisonRecommendations,

  executiveSummary,

  executiveVerdict,

  technologyAnalysis,

  portfolioHealth,

  portfolioInsights,

  architectureIntelligence,

  productivityIntelligence,

  repositoryRiskIntelligence,

};
}