"use client";

import type {
  GithubRepository,
  RepositoryAnalytics,
} from "@/types/github";

import { ExecutiveScoreCard } from "./ExecutiveScoreCard";
import { ExecutiveSummary } from "./ExecutiveSummary";

interface ExecutiveIntelligenceProps {
  repository: GithubRepository;
  analytics: RepositoryAnalytics;
}

export function ExecutiveIntelligence({
  repository,
  analytics,
}: ExecutiveIntelligenceProps) {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Executive Intelligence
        </p>

        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black text-white md:text-4xl">
              {repository.full_name}
            </h2>

            <p className="mt-2 max-w-3xl text-zinc-400">
              Executive-level assessment of repository engineering health,
              maturity, production readiness, and overall engineering quality.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Repository Grade
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              {analytics.repositoryGrade || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ExecutiveScoreCard
          label="Engineering Score"
          value={analytics.engineeringScore}
          description="Overall engineering capability."
        />

        <ExecutiveScoreCard
          label="Health Score"
          value={analytics.healthScore}
          description="Current repository health."
        />

        <ExecutiveScoreCard
          label="Production Score"
          value={analytics.productionScore}
          description="Production readiness assessment."
        />

        <ExecutiveScoreCard
          label="Enterprise Readiness"
          value={analytics.enterpriseReadiness}
          description="Enterprise adoption readiness."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ExecutiveScoreCard
          label="Risk"
          value={analytics.riskLevel}
        />

        <ExecutiveScoreCard
          label="Quality"
          value={analytics.quality || "—"}
        />

        <ExecutiveScoreCard
          label="Maturity"
          value={analytics.maturity || "—"}
        />

        <ExecutiveScoreCard
          label="Deployment"
          value={
            analytics.deploymentReady
              ? "Ready"
              : "Not Ready"
          }
        />
      </div>

      <ExecutiveSummary
        summary={
          analytics.executiveSummary ||
          analytics.enterpriseSummary ||
          "No executive summary is available."
        }
        strengths={analytics.strengths ?? []}
        risks={analytics.risks ?? []}
      />
    </section>
  );
}