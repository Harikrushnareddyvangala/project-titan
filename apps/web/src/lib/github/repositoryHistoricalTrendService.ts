import type {
  PortfolioSnapshot,
} from "./repositorySnapshotService";

export type TrendDirection =
  | "Rapid Growth"
  | "Growing"
  | "Stable"
  | "Declining"
  | "Critical";

  export interface RepositoryHistoricalTrend {

  repositoryName: string;

  engineeringAverage: number;

  securityAverage: number;

  productionAverage: number;

  enterpriseAverage: number;

  hiringAverage: number;

  overallAverage: number;

  engineeringGrowth: number;

  securityGrowth: number;

  productionGrowth: number;

  enterpriseGrowth: number;

  hiringGrowth: number;

  overallGrowth: number;

  stabilityIndex: number;

  confidence: number;

  trendDirection: TrendDirection;

}

export interface PortfolioTrendSummary {

  snapshotCount: number;

  repositoryCount: number;

  averageEngineeringGrowth: number;

  averageSecurityGrowth: number;

  averageProductionGrowth: number;

  averageEnterpriseGrowth: number;

  averageHiringGrowth: number;

  overallPortfolioGrowth: number;

  portfolioStability: number;

  trendConfidence: number;

}
export interface HistoricalExecutiveInsight {

  title: string;

  summary: string;

  recommendation: string;

}

export interface HistoricalTrendHighlights {

  fastestGrowingRepository: string;

  mostStableRepository: string;

  highestEngineeringRepository: string;

  highestSecurityRepository: string;

  highestProductionRepository: string;

  needsAttentionRepository: string;

}

export interface PortfolioHistoricalTrend {

  repositories:
    RepositoryHistoricalTrend[];

  summary:
    PortfolioTrendSummary;

  highlights:
    HistoricalTrendHighlights;

  executiveInsight: HistoricalExecutiveInsight;

}

export interface HistoricalTrendInput {

  snapshots:
    readonly PortfolioSnapshot[];

}

interface RepositoryHistoryPoint {

  capturedAt: Date;

  engineeringScore: number;

  securityScore: number;

  productionScore: number;

  enterpriseScore: number;

  hiringScore: number;

}

interface RepositoryHistory {

  repositoryName: string;

  history: RepositoryHistoryPoint[];

}
function buildRepositoryHistories(
  snapshots: readonly PortfolioSnapshot[],
): RepositoryHistory[] {

  const historyMap = new Map<
    string,
    RepositoryHistory
  >();

  for (const snapshot of snapshots) {

    for (const repository of snapshot.repositories) {

      let history =
        historyMap.get(
          repository.repositoryName,
        );

      if (!history) {

        history = {
          repositoryName:
            repository.repositoryName,

          history: [],
        };

        historyMap.set(
          repository.repositoryName,
          history,
        );

      }

      history.history.push({

        capturedAt:
          snapshot.metadata.capturedAt,

        engineeringScore:
          repository.engineeringScore,

        securityScore:
          repository.securityScore,

        productionScore:
          repository.productionScore,

        enterpriseScore:
          repository.enterpriseReadiness,

        hiringScore:
          repository.recruiterIntelligence
            .hiringScore,

      });

    }

  }

  return Array.from(
    historyMap.values(),
  );

}
function calculateAverage(
  values: number[],
): number {

  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (sum, value) => sum + value,
      0,
    ) / values.length
  );

}
function calculateGrowth(
  values: number[],
): number {

  if (values.length < 2) {
    return 0;
  }

  return (
    values.at(-1)! -
    values[0]
  );

}

function determineTrendDirection(
  growth: number,
): TrendDirection {

  if (growth >= 10) {
    return "Rapid Growth";
  }

  if (growth >= 3) {
    return "Growing";
  }

  if (growth > -3) {
    return "Stable";
  }

  if (growth > -10) {
    return "Declining";
  }

  return "Critical";

}

function calculateStability(
  values: number[],
): number {

  if (values.length < 2) {
    return 100;
  }

  let totalVariation = 0;

  for (
    let index = 1;
    index < values.length;
    index++
  ) {

    totalVariation += Math.abs(
      values[index] -
      values[index - 1],
    );

  }

  const averageVariation =
    totalVariation /
    (values.length - 1);

  return Math.max(
    0,
    100 - averageVariation * 5,
  );

}

function buildRepositoryTrends(
  histories: RepositoryHistory[],
): RepositoryHistoricalTrend[] {

  return histories.map((history) => {

    const engineeringAverage =
      calculateAverage(
        history.history.map(
          (point) =>
            point.engineeringScore,
        ),
      );

    const securityAverage =
      calculateAverage(
        history.history.map(
          (point) =>
            point.securityScore,
        ),
      );

    const productionAverage =
      calculateAverage(
        history.history.map(
          (point) =>
            point.productionScore,
        ),
      );

    const enterpriseAverage =
      calculateAverage(
        history.history.map(
          (point) =>
            point.enterpriseScore,
        ),
      );

    const hiringAverage =
      calculateAverage(
        history.history.map(
          (point) =>
            point.hiringScore,
        ),
      );

    const overallAverage =
      (
        engineeringAverage +
        securityAverage +
        productionAverage +
        enterpriseAverage +
        hiringAverage
      ) / 5;

    const engineeringGrowth =
  calculateGrowth(
    history.history.map(
      (point) =>
        point.engineeringScore,
    ),
  );

const securityGrowth =
  calculateGrowth(
    history.history.map(
      (point) =>
        point.securityScore,
    ),
  );

const productionGrowth =
  calculateGrowth(
    history.history.map(
      (point) =>
        point.productionScore,
    ),
  );

const enterpriseGrowth =
  calculateGrowth(
    history.history.map(
      (point) =>
        point.enterpriseScore,
    ),
  );

const hiringGrowth =
  calculateGrowth(
    history.history.map(
      (point) =>
        point.hiringScore,
    ),
  );
const overallGrowth =
  (
    engineeringGrowth +
    securityGrowth +
    productionGrowth +
    enterpriseGrowth +
    hiringGrowth
  ) / 5;

  const overallHistory =
  history.history.map(
    (point) =>
      (
        point.engineeringScore +
        point.securityScore +
        point.productionScore +
        point.enterpriseScore +
        point.hiringScore
      ) / 5,
  );

const stabilityIndex =
  calculateStability(
    overallHistory,
  );
const confidence =
  Math.min(
    100,
    stabilityIndex +
      history.history.length * 2,
  );

    return {

      repositoryName:
        history.repositoryName,

      engineeringAverage,

      securityAverage,

      productionAverage,

      enterpriseAverage,

      hiringAverage,

      overallAverage,

      engineeringGrowth,

      securityGrowth,

      productionGrowth,

      enterpriseGrowth,

      hiringGrowth,

      overallGrowth,

      stabilityIndex,

      confidence,

      trendDirection: determineTrendDirection(
    overallGrowth,
  ),

    };

  });

}

function getFastestGrowingRepository(
  repositories: RepositoryHistoricalTrend[],
): string {

  if (repositories.length === 0) {
    return "";
  }

  return [...repositories]
    .sort(
      (a, b) =>
        b.overallGrowth -
        a.overallGrowth,
    )[0].repositoryName;

}
function getMostStableRepository(
  repositories: RepositoryHistoricalTrend[],
): string {

  if (repositories.length === 0) {
    return "";
  }

  return [...repositories]
    .sort(
      (a, b) =>
        b.stabilityIndex -
        a.stabilityIndex,
    )[0].repositoryName;

}

function getHighestEngineeringRepository(
  repositories: RepositoryHistoricalTrend[],
): string {

  if (repositories.length === 0) {
    return "";
  }

  return [...repositories]
    .sort(
      (a, b) =>
        b.engineeringAverage -
        a.engineeringAverage,
    )[0].repositoryName;

}

function getHighestSecurityRepository(
  repositories: RepositoryHistoricalTrend[],
): string {

  if (repositories.length === 0) {
    return "";
  }

  return [...repositories]
    .sort(
      (a, b) =>
        b.securityAverage -
        a.securityAverage,
    )[0].repositoryName;

}

function getHighestProductionRepository(
  repositories: RepositoryHistoricalTrend[],
): string {

  if (repositories.length === 0) {
    return "";
  }

  return [...repositories]
    .sort(
      (a, b) =>
        b.productionAverage -
        a.productionAverage,
    )[0].repositoryName;

}

function getNeedsAttentionRepository(
  repositories: RepositoryHistoricalTrend[],
): string {

  if (repositories.length === 0) {
    return "";
  }

  return [...repositories]
    .sort((a, b) => {

      const scoreA =
        a.overallGrowth +
        a.stabilityIndex;

      const scoreB =
        b.overallGrowth +
        b.stabilityIndex;

      return scoreA - scoreB;

    })[0].repositoryName;

}

function buildExecutiveInsight(
  highlights: HistoricalTrendHighlights,
  summary: PortfolioTrendSummary,
): HistoricalExecutiveInsight {

  return {

    title:
      "Historical Portfolio Intelligence",

    summary:
      `${highlights.fastestGrowingRepository} demonstrates the strongest long-term engineering growth while ${highlights.mostStableRepository} maintains the highest historical stability.`,

    recommendation:
      `${highlights.needsAttentionRepository} should receive additional engineering investment to improve long-term portfolio performance.`,

  };

}

export function buildHistoricalTrend(
  input: HistoricalTrendInput,
): PortfolioHistoricalTrend {
    const repositoryHistories =
  buildRepositoryHistories(
    input.snapshots,
  );
    const repositoryTrends =
  buildRepositoryTrends(
    repositoryHistories,
  );
  const averageEngineeringGrowth =
  calculateAverage(
    repositoryTrends.map(
      (repository) =>
        repository.engineeringGrowth,
    ),
  );

const averageSecurityGrowth =
  calculateAverage(
    repositoryTrends.map(
      (repository) =>
        repository.securityGrowth,
    ),
  );

const averageProductionGrowth =
  calculateAverage(
    repositoryTrends.map(
      (repository) =>
        repository.productionGrowth,
    ),
  );

const averageEnterpriseGrowth =
  calculateAverage(
    repositoryTrends.map(
      (repository) =>
        repository.enterpriseGrowth,
    ),
  );

const averageHiringGrowth =
  calculateAverage(
    repositoryTrends.map(
      (repository) =>
        repository.hiringGrowth,
    ),
  );

const overallPortfolioGrowth =
  calculateAverage(
    repositoryTrends.map(
      (repository) =>
        repository.overallGrowth,
    ),
  );

const portfolioStability =
  calculateAverage(
    repositoryTrends.map(
      (repository) =>
        repository.stabilityIndex,
    ),
  );

const trendConfidence =
  calculateAverage(
    repositoryTrends.map(
      (repository) =>
        repository.confidence,
    ),
  );
  const highlights = {

  fastestGrowingRepository:
    getFastestGrowingRepository(
      repositoryTrends,
    ),

  mostStableRepository:
    getMostStableRepository(
      repositoryTrends,
    ),

  highestEngineeringRepository:
    getHighestEngineeringRepository(
      repositoryTrends,
    ),

  highestSecurityRepository:
    getHighestSecurityRepository(
      repositoryTrends,
    ),

  highestProductionRepository:
    getHighestProductionRepository(
      repositoryTrends,
    ),

  needsAttentionRepository:
    getNeedsAttentionRepository(
      repositoryTrends,
    ),

};

const summary: PortfolioTrendSummary = {

  snapshotCount:
    input.snapshots.length,

  repositoryCount:
    repositoryTrends.length,

  averageEngineeringGrowth,

  averageSecurityGrowth,

  averageProductionGrowth,

  averageEnterpriseGrowth,

  averageHiringGrowth,

  overallPortfolioGrowth,

  portfolioStability,

  trendConfidence,

};
    const executiveInsight =
  buildExecutiveInsight(
    highlights,
    summary,
  );
    

  return {

    repositories: repositoryTrends,

    summary,

    highlights,

    executiveInsight,

  };

}
