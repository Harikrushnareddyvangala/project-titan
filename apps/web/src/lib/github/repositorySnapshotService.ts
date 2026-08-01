import type { RepositoryAnalytics } from "@/types/github";

/**
 * Metadata describing a portfolio snapshot.
 */
export interface SnapshotMetadata {
  /**
   * Unique snapshot identifier.
   */
  id: string;

  /**
   * Snapshot creation timestamp.
   */
  capturedAt: Date;

  /**
   * Snapshot format version.
   */
  version: string;

  /**
   * Optional description supplied by the system or user.
   */
  description?: string;
}

/**
 * Aggregated portfolio metrics at snapshot time.
 */
export interface PortfolioSnapshotMetrics {
  repositoryCount: number;

  averageEngineeringScore: number;
  averageSecurityScore: number;
  averageProductionScore: number;
  averageEnterpriseScore: number;
  averageHiringScore: number;

  overallPortfolioScore: number;
}

/**
 * Complete portfolio snapshot.
 */
export interface PortfolioSnapshot {
  metadata: SnapshotMetadata;

  repositories: RepositoryAnalytics[];

  metrics: PortfolioSnapshotMetrics;
}

/**
 * Snapshot comparison result.
 * (Implemented in later steps.)
 */
export interface SnapshotComparison {
  current: PortfolioSnapshot;

  previous: PortfolioSnapshot;

  engineeringDelta: number;
  securityDelta: number;
  productionDelta: number;
  enterpriseDelta: number;
  hiringDelta: number;

  overallDelta: number;
}



class RepositorySnapshotService {
    private static readonly MAX_HISTORY = 100;

  private readonly snapshotHistory: PortfolioSnapshot[] = [];
    buildPortfolioSnapshot(
  repositories: RepositoryAnalytics[],
): PortfolioSnapshot {

  const repositoryCount = repositories.length;

  const averageEngineeringScore =
    repositoryCount === 0
      ? 0
      : repositories.reduce(
          (sum, repository) =>
            sum + repository.engineeringScore,
          0,
        ) / repositoryCount;

  const averageSecurityScore =
    repositoryCount === 0
      ? 0
      : repositories.reduce(
          (sum, repository) =>
            sum + repository.securityScore,
          0,
        ) / repositoryCount;

  const averageProductionScore =
    repositoryCount === 0
      ? 0
      : repositories.reduce(
          (sum, repository) =>
            sum + repository.productionScore,
          0,
        ) / repositoryCount;

  const averageEnterpriseScore =
    repositoryCount === 0
      ? 0
      : repositories.reduce(
          (sum, repository) =>
            sum + repository.enterpriseReadiness,
          0,
        ) / repositoryCount;

  const averageHiringScore =
    repositoryCount === 0
      ? 0
      : repositories.reduce(
          (sum, repository) =>
            sum +
            repository.recruiterIntelligence.hiringScore,
          0,
        ) / repositoryCount;

  const overallPortfolioScore =
    (
      averageEngineeringScore +
      averageSecurityScore +
      averageProductionScore +
      averageEnterpriseScore +
      averageHiringScore
    ) / 5;
  const SNAPSHOT_VERSION = "1.0.0";

  return {
    metadata: {
      id: crypto.randomUUID(),

      capturedAt: new Date(),

      version: SNAPSHOT_VERSION,
    },

    repositories,

    metrics: {
      repositoryCount,

      averageEngineeringScore,

      averageSecurityScore,

      averageProductionScore,

      averageEnterpriseScore,

      averageHiringScore,

      overallPortfolioScore,
    },
  };
}


  addSnapshot(
  snapshot: PortfolioSnapshot,
): void {
    
// Freeze snapshots (recommended) istaed of this.snapshotHistory.push(snapshot);//
  this.snapshotHistory.push(
  Object.freeze(snapshot),
);
  
  if (
        this.snapshotHistory.length >
        RepositorySnapshotService.MAX_HISTORY
    ) {
        this.snapshotHistory.shift();
    }
}

  getLatestSnapshot():
    | PortfolioSnapshot
    | undefined {
    return this.snapshotHistory.at(-1);
  }

  getPreviousSnapshot():
    | PortfolioSnapshot
    | undefined {

    if (this.snapshotHistory.length < 2) {
      return undefined;
    }

    return this.snapshotHistory.at(-2);
  }

  getSnapshotHistory():
    readonly PortfolioSnapshot[] {

    return [...this.snapshotHistory];
  }

  clearSnapshotHistory(): void {
    this.snapshotHistory.length = 0;
  }

  compareSnapshots(
  current: PortfolioSnapshot,
  previous: PortfolioSnapshot,
): SnapshotComparison {

  const engineeringDelta =
    current.metrics.averageEngineeringScore -
    previous.metrics.averageEngineeringScore;

  const securityDelta =
    current.metrics.averageSecurityScore -
    previous.metrics.averageSecurityScore;

  const productionDelta =
    current.metrics.averageProductionScore -
    previous.metrics.averageProductionScore;

  const enterpriseDelta =
    current.metrics.averageEnterpriseScore -
    previous.metrics.averageEnterpriseScore;

  const hiringDelta =
    current.metrics.averageHiringScore -
    previous.metrics.averageHiringScore;

  const overallDelta =
    current.metrics.overallPortfolioScore -
    previous.metrics.overallPortfolioScore;

  return {
    current,

    previous,

    engineeringDelta,

    securityDelta,

    productionDelta,

    enterpriseDelta,

    hiringDelta,

    overallDelta,
  };
}
compareLatestSnapshots():
  | SnapshotComparison
  | undefined {

  const current = this.getLatestSnapshot();
  const previous = this.getPreviousSnapshot();

  if (!current || !previous) {
    return undefined;
  }

  return this.compareSnapshots(
    current,
    previous,
  );
}
}
export const repositorySnapshotService =
  new RepositorySnapshotService();