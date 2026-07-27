"use client";

import { useMemo, useState } from "react";

import type { RankedRepository } from "@/types/github";

import { RepositoryEngineeringInsightsCard } from "./RepositoryEngineeringInsightsCard";
import { RepositoryRankingTable } from "./RepositoryRankingTable";
import { RepositoryScoreBreakdownCard } from "./RepositoryScoreBreakdownCard";
import { ComparativeAnalyticsEngine } from "@/lib/github/comparison/ComparativeAnalyticsEngine";

import { PortfolioComparisonSummary } from "./PortfolioComparisonSummary";
import { CategoryLeadersCard } from "./CategoryLeadersCard";
import { CategoryLaggardsCard } from "./CategoryLaggardsCard";
import { ExecutivePortfolioInsights } from "./ExecutivePortfolioInsights";
interface RepositoryComparisonWorkspaceProps {
  rankings: RankedRepository[];
}

export function RepositoryComparisonWorkspace({
  rankings,
}: RepositoryComparisonWorkspaceProps) {
  /**
   * The highest-ranked repository is selected by default.
   */
  const defaultRepository = useMemo(
    () => rankings[0],
    [rankings]
  );
  const analytics = useMemo(() => {
  if (!rankings.length) {
    return null;
  }

  return ComparativeAnalyticsEngine.analyze(rankings);
}, [rankings]);

  const [selectedRepository, setSelectedRepository] =
    useState<RankedRepository>(defaultRepository);

  return (
  <div className="space-y-8">

    
  <RepositoryRankingTable
    rankings={rankings}
    selectedRepository={selectedRepository}
    onRepositorySelect={setSelectedRepository}
  />

  {selectedRepository && (
    <>
      <RepositoryScoreBreakdownCard
        repository={selectedRepository}
      />

      <RepositoryEngineeringInsightsCard
        repository={selectedRepository}
      />
    </>
  )}

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