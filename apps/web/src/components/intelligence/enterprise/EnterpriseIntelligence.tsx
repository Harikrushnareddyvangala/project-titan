"use client";

import type { RepositoryAnalytics } from "@/types/github";

import { EnterpriseMetricCard } from "./EnterpriseMetricCard";

interface EnterpriseIntelligenceProps {
  analytics: RepositoryAnalytics;
}

export function EnterpriseIntelligence({
  analytics,
}: EnterpriseIntelligenceProps) {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Enterprise Intelligence
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Enterprise Readiness
        </h2>

        <p className="mt-3 max-w-3xl text-zinc-400">
          A consolidated view of security, DevOps,
          architecture maturity, technical risk,
          enterprise readiness, and benchmark performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <EnterpriseMetricCard
          label="Enterprise Readiness"
          value={analytics.enterpriseReadiness}
          description="Overall enterprise adoption readiness."
        />

        <EnterpriseMetricCard
          label="Security Score"
          value={analytics.securityScore}
          description="Repository security assessment."
        />
        
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <EnterpriseMetricCard
          label="Dependency Risk"
          value={analytics.dependencyRisk}
          description="Dependency-related technical risk."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <EnterpriseMetricCard
          label="Production Score"
          value={analytics.productionScore}
          description="Production engineering readiness."
        />
      </div>
    </section>
  );
}