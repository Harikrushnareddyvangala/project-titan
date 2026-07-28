"use client";

import type { PortfolioHealth } from "@/types/github";
import { MetricCard } from "./MetricCard";

interface PortfolioHealthDashboardProps {
  portfolio: PortfolioHealth;
}

export function PortfolioHealthDashboard({
  portfolio,
}: PortfolioHealthDashboardProps) {
  return (
    <section className="space-y-8">

      <div className="rounded-[34px] border border-emerald-400/20 bg-emerald-500/5 p-8 backdrop-blur-3xl">

        <h2 className="text-2xl font-bold text-emerald-300">
          Portfolio Health
        </h2>

        <p className="mt-3 text-zinc-400">
          Executive engineering health across the complete repository portfolio.
        </p>

      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        <MetricCard
          title="Overall"
          value={portfolio.overallScore.toString()}
        />

        <MetricCard
          title="Grade"
          value={portfolio.portfolioGrade}
        />

        <MetricCard
          title="Risk"
          value={portfolio.portfolioRisk}
        />

        <MetricCard
          title="Engineering"
          value={portfolio.engineeringMaturity.toFixed(1)}
        />

        <MetricCard
        title="Production"
        value={portfolio.productionReadiness.toFixed(1)}
        />

        <MetricCard
        title="Security"
        value={portfolio.securityReadiness.toFixed(1)}
        />

        <MetricCard
        title="Enterprise"
        value={portfolio.enterpriseReadiness.toFixed(1)}
        />

        <MetricCard
        title="Hiring"
        value={portfolio.hiringReadiness.toFixed(1)}
        />

      </div>

    </section>
  );
}