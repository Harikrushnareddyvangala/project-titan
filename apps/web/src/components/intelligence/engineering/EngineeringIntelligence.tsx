"use client";

import type { RepositoryAnalytics } from "@/types/github";

import { EngineeringMetricCard } from "./EngineeringMetricCard";

interface EngineeringIntelligenceProps {
  analytics: RepositoryAnalytics;
}

export function EngineeringIntelligence({
  analytics,
}: EngineeringIntelligenceProps) {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Engineering Intelligence
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Engineering Performance
        </h2>

        <p className="mt-3 max-w-3xl text-zinc-400">
          A consolidated view of code quality, maintainability,
          development performance, stability, and release readiness.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <EngineeringMetricCard
          label="Code Quality"
          value={analytics.codeQuality}
          description="Assessment of repository code quality."
        />

        <EngineeringMetricCard
          label="Maintainability"
          value={analytics.maintainability}
          description="Maintainability of the engineering codebase."
        />

        <EngineeringMetricCard
          label="Engineering Stability"
          value={analytics.engineeringStability}
          description="Stability of repository engineering activity."
        />

        <EngineeringMetricCard
          label="Release Readiness"
          value={analytics.releaseReadiness}
          description="Readiness for reliable release."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <EngineeringMetricCard
          label="Development Velocity"
          value={analytics.developmentVelocity}
          description={`${analytics.commitsPerWeek} commits per week.`}
        />

        <EngineeringMetricCard
          label="Development Momentum"
          value={analytics.developmentMomentum}
          description="Current development momentum."
        />

        <EngineeringMetricCard
          label="Recent Commits"
          value={analytics.recentCommits}
          description="Recent repository activity."
        />

        <EngineeringMetricCard
          label="Activity Trend"
          value={analytics.activityTrend || "—"}
          description="Current repository activity direction."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <EngineeringMetricCard
          label="Total Commits"
          value={analytics.totalCommits}
        />

        <EngineeringMetricCard
          label="Contributor Count"
          value={analytics.contributorCount}
        />

        <EngineeringMetricCard
          label="Collaboration Index"
          value={analytics.collaborationIndex}
        />
      </div>
    </section>
  );
}