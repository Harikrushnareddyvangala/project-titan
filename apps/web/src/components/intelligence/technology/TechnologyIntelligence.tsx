"use client";

import type { RepositoryAnalytics } from "@/types/github";

import { TechnologyMetricCard } from "./TechnologyMetricCard";

interface TechnologyIntelligenceProps {
  analytics: RepositoryAnalytics;
}

export function TechnologyIntelligence({
  analytics,
}: TechnologyIntelligenceProps) {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Technology Intelligence
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Technology Stack
        </h2>

        <p className="mt-3 max-w-3xl text-zinc-400">
          A consolidated view of the repository&apos;s
          application stack, infrastructure, AI technologies,
          package management, and technology maturity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TechnologyMetricCard
          label="Frontend"
          value={analytics.frontend}
          description="Primary frontend technology."
        />

        <TechnologyMetricCard
          label="Backend"
          value={analytics.backend}
          description="Primary backend technology."
        />

        <TechnologyMetricCard
          label="Database"
          value={analytics.database}
          description="Primary database technology."
        />

        <TechnologyMetricCard
          label="Cloud"
          value={analytics.cloud}
          description="Cloud infrastructure."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TechnologyMetricCard
          label="AI Framework"
          value={analytics.aiFramework}
          description="Primary AI framework."
        />

        <TechnologyMetricCard
          label="Vector Database"
          value={analytics.vectorDatabase}
          description="Vector data infrastructure."
        />

        <TechnologyMetricCard
          label="Package Manager"
          value={analytics.packageManager}
          description="Dependency management tooling."
        />

        <TechnologyMetricCard
          label="AI Library"
          value={analytics.aiLibrary}
          description="AI/ML library detected in the repository."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <TechnologyMetricCard
          label="Frontend Framework"
          value={analytics.frontendFramework}
        />

        <TechnologyMetricCard
          label="Backend Framework"
          value={analytics.backendFramework}
        />

        <TechnologyMetricCard
          label="Technology Maturity"
          value={analytics.technologyMaturity}
        />

        <TechnologyMetricCard
          label="Dependency Risk"
          value={analytics.dependencyRisk}
        />

        <TechnologyMetricCard
          label="Language Count"
          value={analytics.languageCount}
          description="Number of languages detected."
        />

      </div>
    </section>
  );
}