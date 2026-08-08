"use client";

import type { RepositoryAnalytics } from "@/types/github";

import { DevelopmentMetricCard } from "./DevelopmentMetricCard";

interface DevelopmentIntelligenceProps {
  analytics: RepositoryAnalytics;
}

export function DevelopmentIntelligence({
  analytics,
}: DevelopmentIntelligenceProps) {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Development Intelligence
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Development Activity
        </h2>

        <p className="mt-3 max-w-3xl text-zinc-400">
          A consolidated view of development velocity, repository
          activity, collaboration, stability, and contributor health.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DevelopmentMetricCard
          label="Development Velocity"
          value={analytics.developmentVelocity}
          description="Current engineering delivery velocity."
        />

        <DevelopmentMetricCard
          label="Development Momentum"
          value={analytics.developmentMomentum}
          description="Current direction of development activity."
        />

        <DevelopmentMetricCard
          label="Activity Trend"
          value={analytics.activityTrend || "—"}
          description="Recent repository activity direction."
        />

        <DevelopmentMetricCard
          label="Engineering Stability"
          value={analytics.engineeringStability}
          description="Stability of engineering activity."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DevelopmentMetricCard
          label="Total Commits"
          value={analytics.totalCommits}
          description="Total repository commits analyzed."
        />

        <DevelopmentMetricCard
          label="Recent Commits"
          value={analytics.recentCommits}
          description="Recent repository commits."
        />

        <DevelopmentMetricCard
          label="Commits / Week"
          value={analytics.commitsPerWeek}
          description="Average weekly commit activity."
        />

        <DevelopmentMetricCard
          label="Contributors"
          value={analytics.contributorCount}
          description="Contributors detected in the repository."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DevelopmentMetricCard
          label="Collaboration Index"
          value={analytics.collaborationIndex}
          description="Repository collaboration signal."
        />

        <DevelopmentMetricCard
          label="Team Health"
          value={analytics.teamHealth}
          description="Overall contributor and team health."
        />

      </div>
    </section>
  );
}