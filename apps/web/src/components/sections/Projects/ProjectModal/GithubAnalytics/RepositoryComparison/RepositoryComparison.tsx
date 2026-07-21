"use client";

import type { RepositoryAnalytics } from "@/types/github";

import { ComparisonSelector } from "./ComparisonSelector";
import { ComparisonTable } from "./ComparisonTable";
import { ComparisonRadar } from "./ComparisonRadar";
import { ComparisonRanking } from "./ComparisonRanking";
import { ComparisonInsights } from "./ComparisonInsights";

interface RepositoryComparisonData {
  id: number;
  name: string;
  fullName: string;
  analytics: RepositoryAnalytics;
}

interface RepositoryComparisonProps {

  repositories: RepositoryComparisonData[];

  selected: number[];

  onSelectionChange: (
    selected: number[],
  ) => void;

}

export function RepositoryComparison({

  repositories,

  selected,

  onSelectionChange,

}: RepositoryComparisonProps) {

  const selectedRepositories =
    repositories.filter(repo =>
      selected.includes(repo.id),
    );

  return (

    <section className="space-y-8">

      <ComparisonSelector
        repositories={repositories}
        selected={selected}
        onChange={onSelectionChange}
      />

      {

        selectedRepositories.length >= 2 && (

          <>

            <ComparisonTable
              repositories={selectedRepositories}
            />

            <ComparisonRadar
              repositories={selectedRepositories}
            />

            <ComparisonRanking
              repositories={selectedRepositories}
            />

            <ComparisonInsights
              repositories={selectedRepositories}
            />

          </>

        )

      }

    </section>

  );

}