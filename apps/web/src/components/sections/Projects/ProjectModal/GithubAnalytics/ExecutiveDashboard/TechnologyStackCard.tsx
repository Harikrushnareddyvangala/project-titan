"use client";

import type { RepositoryAnalytics } from "@/types/github";

interface Props {
  analytics: RepositoryAnalytics;
}

function TechBadge({
  title,
  value,
}: {
  title: string;
  value: string;
}) {

  return (

    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">

      <p className="text-xs uppercase tracking-widest text-zinc-400">
        {title}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>

    </div>

  );

}

export function TechnologyStackCard({
  analytics,
}: Props) {

  return (

    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h2 className="text-2xl font-bold">
        Technology Stack
      </h2>

      <p className="mt-2 text-sm text-zinc-400">
        AI detected architecture
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <TechBadge
          title="Frontend"
          value={analytics.frontend}
        />

        <TechBadge
          title="Backend"
          value={analytics.backend}
        />

        <TechBadge
          title="Database"
          value={analytics.database}
        />

        <TechBadge
          title="AI Framework"
          value={analytics.aiFramework}
        />

        <TechBadge
          title="Vector Database"
          value={analytics.vectorDatabase}
        />

        <TechBadge
          title="Cloud"
          value={analytics.cloud}
        />

      </div>

    </section>

  );

}