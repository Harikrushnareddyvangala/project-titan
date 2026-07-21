"use client";

import type { RepositoryAnalytics } from "@/types/github";

import { ExecutiveSummaryCard } from "./ExecutiveSummaryCard";

interface ExecutiveDashboardProps {
  analytics: RepositoryAnalytics | null;
}

export function ExecutiveDashboard({
  analytics,
}: ExecutiveDashboardProps) {
  if (!analytics) return null;

  return (
    <section className="mt-8 space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Executive AI Dashboard
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            AI-generated engineering assessment and enterprise readiness
          </p>
        </div>

        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <span className="text-sm font-semibold text-emerald-400">
            Enterprise Intelligence
          </span>
        </div>
      </div>

      <ExecutiveSummaryCard analytics={analytics} />

    </section>
  );
}