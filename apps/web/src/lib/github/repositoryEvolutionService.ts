import type {
  PortfolioSnapshot,
} from "./repositorySnapshotService";

import type {
  EvolutionDirection,
  RepositoryLifecycle,
} from "@/types/intelligence";

export interface RepositoryEvolution {
  repositoryName: string;

  engineeringChange: number;
  securityChange: number;
  productionChange: number;
  enterpriseChange: number;
  hiringChange: number;

  overallChange: number;

  evolutionDirection: EvolutionDirection;
  lifecycle: RepositoryLifecycle;
}

export interface PortfolioEvolutionSummary {
  repositoryCount: number;

  averageEngineeringChange: number;
  averageSecurityChange: number;
  averageProductionChange: number;
  averageEnterpriseChange: number;
  averageHiringChange: number;

  overallPortfolioChange: number;
}

export interface EvolutionHighlights {
  mostImprovedRepository: string;

  mostStableRepository: string;

  needsAttentionRepository: string;

  fastestGrowingRepository: string;
}

export interface PortfolioEvolution {
  repositories: RepositoryEvolution[];

  summary: PortfolioEvolutionSummary;

  highlights: EvolutionHighlights;

  executiveSummary: string;
}

export interface RepositoryEvolutionInput {
  current: PortfolioSnapshot;
  previous: PortfolioSnapshot;
}

function classifyEvolution(
  overallChange: number,
): EvolutionDirection {

  if (overallChange >= 8) {
    return "Rapidly Improving";
  }

  if (overallChange >= 2) {
    return "Improving";
  }

  if (overallChange <= -8) {
    return "Critical";
  }

  if (overallChange <= -2) {
    return "Declining";
  }

  return "Stable";
}

export function buildPortfolioEvolution({
  current,
  previous,
}: RepositoryEvolutionInput): PortfolioEvolution {

  const previousRepositoryMap =
  new Map(
    previous.repositories.map(
      (repository) => [
        repository.repositoryName,
        repository,
      ],
    ),
  );

const repositoryEvolution: RepositoryEvolution[] =
  current.repositories.flatMap(
    (repository) => {

      const previousRepository =
        previousRepositoryMap.get(
          repository.repositoryName,
        );

      if (!previousRepository) {
        return [];
      }

        const engineeringChange =
          repository.engineeringScore -
          previousRepository.engineeringScore;

        const securityChange =
          repository.securityScore -
          previousRepository.securityScore;

        const productionChange =
          repository.productionScore -
          previousRepository.productionScore;

        const enterpriseChange =
          repository.enterpriseReadiness -
          previousRepository.enterpriseReadiness;

        const hiringChange =
          repository.recruiterIntelligence.hiringScore -
          previousRepository.recruiterIntelligence.hiringScore;

        const overallChange =
          (
            engineeringChange +
            securityChange +
            productionChange +
            enterpriseChange +
            hiringChange
          ) / 5;

        const evolutionDirection =
  classifyEvolution(
    overallChange,
  );

        return {
          repositoryName:
            repository.repositoryName,

          engineeringChange,

          securityChange,

          productionChange,

          enterpriseChange,

          hiringChange,

          overallChange,

          evolutionDirection,

           lifecycle: "Existing",
        };

      },
    );

  const summary: PortfolioEvolutionSummary = {

    repositoryCount:
      repositoryEvolution.length,

    averageEngineeringChange:
      repositoryEvolution.reduce(
        (sum, repository) =>
          sum + repository.engineeringChange,
        0,
      ) / repositoryEvolution.length,

    averageSecurityChange:
      repositoryEvolution.reduce(
        (sum, repository) =>
          sum + repository.securityChange,
        0,
      ) / repositoryEvolution.length,

    averageProductionChange:
      repositoryEvolution.reduce(
        (sum, repository) =>
          sum + repository.productionChange,
        0,
      ) / repositoryEvolution.length,

    averageEnterpriseChange:
      repositoryEvolution.reduce(
        (sum, repository) =>
          sum + repository.enterpriseChange,
        0,
      ) / repositoryEvolution.length,

    averageHiringChange:
      repositoryEvolution.reduce(
        (sum, repository) =>
          sum + repository.hiringChange,
        0,
      ) / repositoryEvolution.length,

    overallPortfolioChange:
      repositoryEvolution.reduce(
        (sum, repository) =>
          sum + repository.overallChange,
        0,
      ) / repositoryEvolution.length,

  };

  const sorted =
    [...repositoryEvolution].sort(
      (a, b) =>
        b.overallChange -
        a.overallChange,
    );

  const highlights: EvolutionHighlights = {

    mostImprovedRepository:
      sorted[0]?.repositoryName ?? "",

    fastestGrowingRepository:
      sorted[0]?.repositoryName ?? "",

    needsAttentionRepository:
      sorted.at(-1)?.repositoryName ?? "",

    mostStableRepository:
      [...repositoryEvolution]
        .sort(
          (a, b) =>
            Math.abs(a.overallChange) -
            Math.abs(b.overallChange),
        )[0]?.repositoryName ?? "",

  };

  const executiveSummary =
    `${highlights.mostImprovedRepository} is showing the strongest engineering evolution while ${highlights.needsAttentionRepository} requires additional engineering attention.`;

  return {

    repositories:
      repositoryEvolution,

    summary,

    highlights,

    executiveSummary,

  };

}