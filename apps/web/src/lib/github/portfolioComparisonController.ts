import type {
  RepositoryAnalytics,
  RepositoryComparison,
} from "@/types/github";

import {
  repositorySnapshotService,
} from "./repositorySnapshotService";

import {
  buildRepositoryComparison,
} from "./repositoryComparisonEngine";

export class PortfolioComparisonController {

  private lastPortfolioSignature = "";

  private buildPortfolioSignature(
    repositories: RepositoryAnalytics[],
  ): string {

    return repositories
      .map((repository) => ({
        repository: repository.repositoryName,
        engineering: repository.engineeringScore,
        security: repository.securityScore,
        production: repository.productionScore,
        enterprise: repository.enterpriseReadiness,
        hiring:
          repository.recruiterIntelligence
            .hiringScore,
      }))
      .sort(
        (a, b) =>
          a.repository.localeCompare(
            b.repository,
          ),
      )
      .map((repository) =>
        JSON.stringify(repository),
      )
      .join("|");

  }

  captureSnapshotIfNeeded(
    repositories: RepositoryAnalytics[],
  ): void {

    if (repositories.length < 2) {
      return;
    }

    const signature =
      this.buildPortfolioSignature(
        repositories,
      );

    if (
      signature ===
      this.lastPortfolioSignature
    ) {
      return;
    }

    const snapshot =
      repositorySnapshotService
        .buildPortfolioSnapshot(
          repositories,
        );

    repositorySnapshotService
      .addSnapshot(snapshot);

    this.lastPortfolioSignature =
      signature;

  }

  buildComparison(
    repositories: RepositoryAnalytics[],
  ): RepositoryComparison {

    return buildRepositoryComparison(
      repositories,
    );

  }

}

export const portfolioComparisonController =
  new PortfolioComparisonController();