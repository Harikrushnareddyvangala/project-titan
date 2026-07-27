"use client";

import { useMemo, useState } from "react";

import type { RankedRepository } from "@/types/github";

import { ComparativeAnalyticsEngine } from "@/lib/github/comparison/ComparativeAnalyticsEngine";

import { CategoryLaggardsCard } from "./CategoryLaggardsCard";
import { CategoryLeadersCard } from "./CategoryLeadersCard";
import { ExecutivePortfolioInsights } from "./ExecutivePortfolioInsights";
import { PortfolioComparisonSummary } from "./PortfolioComparisonSummary";
import { RepositoryEngineeringInsightsCard } from "./RepositoryEngineeringInsightsCard";
import { RepositoryRankingTable } from "./RepositoryRankingTable";
import { RepositoryScoreBreakdownCard } from "./RepositoryScoreBreakdownCard";

interface RepositoryComparisonWorkspaceProps {
  rankings: RankedRepository[];
}

export function RepositoryComparisonWorkspace({
  rankings,
}: RepositoryComparisonWorkspaceProps) {
  /**
   * No repositories available.
   */
  

  /**
   * Track only the selected repository identifier.
   * The actual repository is derived from the current rankings.
   */
  const [selectedRepositoryId, setSelectedRepositoryId] =
    useState<string>("");

  /**
   * Resolve the selected repository.
   * Falls back to the highest-ranked repository.
   */
  const selectedRepository = useMemo(() => {
  if (rankings.length === 0) {
    return undefined;
  }

  if (!selectedRepositoryId) {
    return rankings[0];
  }

  return (
    rankings.find(
      (repository) =>
        repository.repositoryName === selectedRepositoryId,
    ) ?? rankings[0]
  );
}, [rankings, selectedRepositoryId]);

  /**
   * Portfolio analytics are only meaningful when
   * comparing two or more repositories.
   */
  const analytics = useMemo(() => {
    if (rankings.length < 2) {
      return null;
    }

    return ComparativeAnalyticsEngine.analyze(rankings);
  }, [rankings]);
if (selectedRepository === undefined) {
  return null;
}
  return (
    <div className="space-y-8">
      <RepositoryRankingTable
        rankings={rankings}
        selectedRepository={selectedRepository}
        onRepositorySelect={(repository) =>
          setSelectedRepositoryId(repository.repositoryName)
        }
      />

      <RepositoryScoreBreakdownCard
        repository={selectedRepository}
      />

      <RepositoryEngineeringInsightsCard
        repository={selectedRepository}
      />

      {analytics && (
        <>
          <PortfolioComparisonSummary
            analytics={analytics}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <CategoryLeadersCard
              leaders={analytics.categoryLeaders}
            />

            <CategoryLaggardsCard
              laggards={analytics.categoryLaggards}
            />
          </div>

          <ExecutivePortfolioInsights
            observations={
              analytics.executiveObservations
            }
          />
        </>
      )}
    </div>
  );
}