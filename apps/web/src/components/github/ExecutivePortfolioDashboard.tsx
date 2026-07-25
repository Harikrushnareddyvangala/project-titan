"use client";

import type {
  PortfolioAnalytics,
  RepositoryAnalytics,
  PortfolioIntelligence,
} from "@/types/github";

import { PortfolioIntelligenceDashboard } from "./PortfolioIntelligenceDashboard";
import { RepositoryLeaderboard } from "./RepositoryLeaderboard";
import { EngineeringRadar } from "./EngineeringRadar";
import { TechnologyDistribution } from "./TechnologyDistribution";
import { ExecutiveSummaryCard, } from "./ExecutiveSummaryCard";

import type { ExecutiveSummary, } from "@/types/github";

interface Props {

portfolio: PortfolioAnalytics;

intelligence: PortfolioIntelligence;

repositories: RepositoryAnalytics[];

executiveSummary: ExecutiveSummary;

}

export function ExecutivePortfolioDashboard({

  portfolio,

  intelligence,

  repositories,

  executiveSummary,

}: Props) {

  return (

    <section className="space-y-10">

      <PortfolioIntelligenceDashboard

        portfolio={portfolio}
        intelligence={intelligence}

      />
      <ExecutiveSummaryCard

summary={executiveSummary}

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
<TechnologyDistribution

  repositories={repositories}

/>

        {/* Engineering Radar */}

        {/* Commit 0170 */}

        {/* AI Executive Summary */}

      </div>

    </section>

  );

}