import type {
  PortfolioHistoricalTrend,
} from "./repositoryHistoricalTrendService";

export type ForecastDirection =
  | "Strong Growth"
  | "Growing"
  | "Stable"
  | "Declining"
  | "High Risk";

export interface RepositoryForecast {

  repositoryName: string;

  currentEngineeringScore: number;
  predictedEngineeringScore: number;

  currentSecurityScore: number;
  predictedSecurityScore: number;

  currentProductionScore: number;
  predictedProductionScore: number;

  currentEnterpriseScore: number;
  predictedEnterpriseScore: number;

  currentHiringScore: number;
  predictedHiringScore: number;

  overallPrediction: number;

  forecastConfidence: number;

  forecastDirection: ForecastDirection;

  predictedRisk: string;

}

export interface PortfolioForecast {

  repositories: RepositoryForecast[];

  averageEngineeringForecast: number;

  averageSecurityForecast: number;

  averageProductionForecast: number;

  averageEnterpriseForecast: number;

  averageHiringForecast: number;

  overallPortfolioForecast: number;

  forecastConfidence: number;

  executiveForecast: ExecutiveForecast;

}
export interface ExecutiveForecast {

  title: string;

  summary: string;

  recommendation: string;

}
export interface RepositoryForecastInput {

  historicalTrend:
    PortfolioHistoricalTrend;

}

export function buildRepositoryForecast(
  input: RepositoryForecastInput,
): PortfolioForecast {

  const repositories =
    buildRepositoryPredictions(
      input.historicalTrend,
    );

  const portfolio =
    buildPortfolioForecast(
      repositories,
    );

  const executiveForecast =
    buildExecutiveForecast(
      portfolio,
    );

  return {

    repositories,

    averageEngineeringForecast:
      portfolio.averageEngineeringForecast,

    averageSecurityForecast:
      portfolio.averageSecurityForecast,

    averageProductionForecast:
      portfolio.averageProductionForecast,

    averageEnterpriseForecast:
      portfolio.averageEnterpriseForecast,

    averageHiringForecast:
      portfolio.averageHiringForecast,

    overallPortfolioForecast:
      portfolio.overallPortfolioForecast,

    forecastConfidence:
      portfolio.forecastConfidence,

    executiveForecast,

  };

}
function buildRepositoryPredictions(
  historicalTrend: PortfolioHistoricalTrend,
): RepositoryForecast[] {

  return historicalTrend.repositories.map(
    (repository) => {

      const predictedEngineering =
    predictMetric(
        repository.engineeringAverage,
        repository.engineeringGrowth,
    );

const predictedSecurity =
    predictMetric(
        repository.securityAverage,
        repository.securityGrowth,
    );

const predictedProduction =
    predictMetric(
        repository.productionAverage,
        repository.productionGrowth,
    );

const predictedEnterprise =
    predictMetric(
        repository.enterpriseAverage,
        repository.enterpriseGrowth,
    );

const predictedHiring =
    predictMetric(
        repository.hiringAverage,
        repository.hiringGrowth,
    );
      const overallPrediction =
        (
          predictedEngineering +
          predictedSecurity +
          predictedProduction +
          predictedEnterprise +
          predictedHiring
        ) / 5;

      const forecastConfidence =
        calculateForecastConfidence(
          repository,
        );

      const forecastDirection =
        determineForecastDirection(
          repository.overallGrowth,
        );

      const predictedRisk =
        determinePredictedRisk(
          overallPrediction,
        );

      return {

        repositoryName:
          repository.repositoryName,

        currentEngineeringScore:
    repository.engineeringAverage,

predictedEngineeringScore:
    predictedEngineering,

currentSecurityScore:
    repository.securityAverage,

predictedSecurityScore:
    predictedSecurity,

currentProductionScore:
    repository.productionAverage,

predictedProductionScore:
    predictedProduction,

currentEnterpriseScore:
    repository.enterpriseAverage,

predictedEnterpriseScore:
    predictedEnterprise,

currentHiringScore:
    repository.hiringAverage,

predictedHiringScore:
    predictedHiring,

        overallPrediction,

        forecastConfidence,

        forecastDirection,

        predictedRisk,

      };

    },
  );

}
function predictMetric(
  current: number,
  growth: number,
): number {

  const prediction =
    current + growth;

  return Math.max(
    0,
    Math.min(
      100,
      prediction,
    ),
  );

}
function calculateForecastConfidence(
  repository:
    PortfolioHistoricalTrend["repositories"][number],
): number {

  return (
    repository.confidence * 0.6 +
    repository.stabilityIndex * 0.4
  );

}
function determineForecastDirection(
  growth: number,
): ForecastDirection {

  if (growth >= 8)
    return "Strong Growth";

  if (growth >= 3)
    return "Growing";

  if (growth >= -2)
    return "Stable";

  if (growth >= -8)
    return "Declining";

  return "High Risk";

}
function determinePredictedRisk(
  prediction: number,
): string {

  if (prediction >= 90)
    return "Very Low";

  if (prediction >= 80)
    return "Low";

  if (prediction >= 70)
    return "Moderate";

  if (prediction >= 60)
    return "Elevated";

  return "High";

}
interface PortfolioForecastSummary {

  averageEngineeringForecast: number;

  averageSecurityForecast: number;

  averageProductionForecast: number;

  averageEnterpriseForecast: number;

  averageHiringForecast: number;

  overallPortfolioForecast: number;

  forecastConfidence: number;

}
function buildPortfolioForecast(
  repositories: RepositoryForecast[],
): PortfolioForecastSummary {

  if (repositories.length === 0) {

    return {

      averageEngineeringForecast: 0,

      averageSecurityForecast: 0,

      averageProductionForecast: 0,

      averageEnterpriseForecast: 0,

      averageHiringForecast: 0,

      overallPortfolioForecast: 0,

      forecastConfidence: 0,

    };

  }

  const averageEngineeringForecast =
    repositories.reduce(
      (sum, repository) =>
        sum +
        repository.predictedEngineeringScore,
      0,
    ) / repositories.length;

  const averageSecurityForecast =
    repositories.reduce(
      (sum, repository) =>
        sum +
        repository.predictedSecurityScore,
      0,
    ) / repositories.length;

  const averageProductionForecast =
    repositories.reduce(
      (sum, repository) =>
        sum +
        repository.predictedProductionScore,
      0,
    ) / repositories.length;

  const averageEnterpriseForecast =
    repositories.reduce(
      (sum, repository) =>
        sum +
        repository.predictedEnterpriseScore,
      0,
    ) / repositories.length;

  const averageHiringForecast =
    repositories.reduce(
      (sum, repository) =>
        sum +
        repository.predictedHiringScore,
      0,
    ) / repositories.length;

  const overallPortfolioForecast =
    (
      averageEngineeringForecast +
      averageSecurityForecast +
      averageProductionForecast +
      averageEnterpriseForecast +
      averageHiringForecast
    ) / 5;

  const forecastConfidence =
    repositories.reduce(
      (sum, repository) =>
        sum +
        repository.forecastConfidence,
      0,
    ) / repositories.length;

  return {

    averageEngineeringForecast,

    averageSecurityForecast,

    averageProductionForecast,

    averageEnterpriseForecast,

    averageHiringForecast,

    overallPortfolioForecast,

    forecastConfidence,

  };

}
function buildExecutiveForecast(
  portfolio: PortfolioForecastSummary,
): ExecutiveForecast {

  let title =
    "Stable Engineering Portfolio";

  if (
    portfolio.overallPortfolioForecast >= 90
  ) {

    title =
      "Elite Engineering Portfolio";

  } else if (
    portfolio.overallPortfolioForecast >= 80
  ) {

    title =
      "Strong Engineering Growth";

  } else if (
    portfolio.overallPortfolioForecast < 60
  ) {

    title =
      "Engineering Improvement Required";

  }

  const summary =
    `Portfolio forecast predicts an overall engineering maturity of ${portfolio.overallPortfolioForecast.toFixed(
      1,
    )}% with ${portfolio.forecastConfidence.toFixed(
      1,
    )}% forecast confidence.`;

  let recommendation =
    "Continue maintaining engineering best practices.";

  if (
    portfolio.overallPortfolioForecast < 70
  ) {

    recommendation =
      "Prioritize engineering quality, production readiness, and repository modernization.";

  }

  return {

    title,

    summary,

    recommendation,

  };

}