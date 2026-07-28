"use client";

import type { PortfolioInsights } from "@/types/github";

interface PortfolioInsightsDashboardProps {
  insights: PortfolioInsights;
}

export function PortfolioInsightsDashboard({
  insights,
}: PortfolioInsightsDashboardProps) {
  return (
    <section className="space-y-8">

      <div className="rounded-[34px] border border-cyan-400/20 bg-cyan-500/5 p-8 backdrop-blur-3xl">

        <h2 className="text-2xl font-bold text-cyan-300">
          Executive Portfolio Insights
        </h2>

        <p className="mt-3 text-zinc-400">
          Strategic analysis of your engineering portfolio.
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border border-emerald-400/20 p-6">
          <h3 className="mb-4 text-lg font-semibold text-emerald-300">
            Strengths
          </h3>

          <ul className="space-y-2">
            {insights.strengths.map((item) => (
              <li key={item} className="text-sm text-zinc-300">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-red-400/20 p-6">
          <h3 className="mb-4 text-lg font-semibold text-red-300">
            Risks
          </h3>

          <ul className="space-y-2">
            {insights.risks.map((item) => (
              <li key={item} className="text-sm text-zinc-300">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-400/20 p-6">
          <h3 className="mb-4 text-lg font-semibold text-amber-300">
            Priorities
          </h3>

          <ul className="space-y-2">
            {insights.priorities.map((item, index) => (
              <li key={item} className="text-sm text-zinc-300">
                <span className="font-semibold text-amber-300">
  {index + 1}.
</span>{" "}
{item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="rounded-2xl border border-zinc-700 p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Executive Summary
        </h3>

        <p className="text-zinc-300">
          {insights.executiveSummary}
        </p>
      </div>

    </section>
  );
}