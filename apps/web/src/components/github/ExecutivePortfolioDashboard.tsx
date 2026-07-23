"use client";

import type {
  PortfolioAnalytics,
  RepositoryAnalytics,
} from "@/types/github";

import { PortfolioIntelligenceDashboard } from "./PortfolioIntelligenceDashboard";

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

        {/* Commit 0169C */}

        {/* Engineering Radar */}

        {/* Commit 0170 */}

        {/* AI Executive Summary */}

      </div>

    </section>

  );

}