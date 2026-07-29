"use client";

import type { ArchitectureIntelligence } from "@/types/github";
import { MetricCard } from "./MetricCard";

interface ArchitectureIntelligenceDashboardProps {
  architecture: ArchitectureIntelligence;
}

export function ArchitectureIntelligenceDashboard({
  architecture,
}: ArchitectureIntelligenceDashboardProps) {
  return (
    <section className="space-y-8">

      <div className="rounded-[34px] border border-violet-400/20 bg-violet-500/5 p-8 backdrop-blur-3xl">

        <h2 className="text-2xl font-bold text-violet-300">
          Architecture Intelligence
        </h2>

        <p className="mt-3 text-zinc-400">
          Cross-repository architecture consistency and technology standardization.
        </p>

      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        <MetricCard
          title="Frontend"
          value={architecture.frontendConsistency.toFixed(1)}
        />

        <MetricCard
          title="Backend"
          value={architecture.backendConsistency.toFixed(1)}
        />

        <MetricCard
          title="Frameworks"
          value={architecture.frameworkConsistency.toFixed(1)}
        />

        <MetricCard
          title="Databases"
          value={architecture.databaseConsistency.toFixed(1)}
        />

        <MetricCard
          title="Cloud"
          value={architecture.cloudConsistency.toFixed(1)}
        />

        <MetricCard
          title="AI"
          value={architecture.aiConsistency.toFixed(1)}
        />

        <MetricCard
          title="Diversity"
          value={architecture.technologyDiversity.toFixed(1)}
        />

        <MetricCard
          title="Grade"
          value={architecture.architectureGrade}
        />

      </div>

      <div className="rounded-2xl border border-violet-400/20 p-6">

        <h3 className="mb-4 text-lg font-semibold text-violet-300">
          Architecture Recommendations
        </h3>

        {architecture.recommendations.length === 0 ? (
          <p className="text-zinc-500">
            Recommendations will be generated after consistency analysis is implemented.
          </p>
        ) : (
          <ul className="space-y-2">
            {architecture.recommendations.map((recommendation) => (
              <li
                key={recommendation}
                className="text-zinc-300"
              >
                • {recommendation}
              </li>
            ))}
          </ul>
        )}

      </div>

    </section>
  );
}