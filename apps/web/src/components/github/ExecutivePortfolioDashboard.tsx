"use client";

import type {
  PortfolioAnalytics,
  RepositoryAnalytics,
} from "@/types/github";

import { PortfolioIntelligenceDashboard } from "./PortfolioIntelligenceDashboard";
import { RepositoryLeaderboard } from "./RepositoryLeaderboard";
import { EngineeringRadar } from "./EngineeringRadar";

interface Props {

  portfolio: PortfolioAnalytics;

  repositories: RepositoryAnalytics[];

}

export function ExecutivePortfolioDashboard({

  portfolio,

  repositories,

}: Props) {

  return (

    <section className="space-y-10">

      <PortfolioIntelligenceDashboard

        portfolio={portfolio}

      />

      <div

        className="grid gap-8"

      >

        {/* Commit 0169B */}

        {/* Repository Leaderboard */}
<RepositoryLeaderboard

  repositories={repositories}

/>
 <EngineeringRadar

  repository={repositories[0]}

/>

        {/* Engineering Radar */}

        {/* Commit 0170 */}

        {/* AI Executive Summary */}

      </div>

    </section>

  );

}