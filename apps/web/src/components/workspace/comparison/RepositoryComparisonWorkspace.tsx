"use client";

import { useMemo, useState } from "react";

import type { RankedRepository } from "@/types/github";

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
   * The highest-ranked repository is selected by default.
   */
  const defaultRepository = useMemo(
    () => rankings[0],
    [rankings]
  );

  const [selectedRepository, setSelectedRepository] =
    useState<RankedRepository>(defaultRepository);

  return (
  <div className="space-y-8">

    <RepositoryRankingTable
      rankings={rankings}
      selectedRepository={selectedRepository}
      onRepositorySelect={setSelectedRepository}
    />

    <RepositoryScoreBreakdownCard
      repository={selectedRepository}
    />

    <RepositoryEngineeringInsightsCard
      repository={selectedRepository}
    />

  </div>
);
}