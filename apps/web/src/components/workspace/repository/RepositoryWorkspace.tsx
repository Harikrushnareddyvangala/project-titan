"use client";

import { WorkspaceHeader } from "@/components/workspace/shared/WorkspaceHeader";
import { GithubAnalyticsSection } from "@/components/sections/Projects/ProjectModal/GithubAnalyticsSection";
import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";
import { RepositoryIntelligence } from "@/components/intelligence";
export function RepositoryWorkspace() {
  return (
    <RepositoryAnalysisContainer>
      {(github) => (
        <div className="space-y-14">
          <WorkspaceHeader
            title="Repository Workspace"
            description="Explore comprehensive repository intelligence including engineering quality, contributors, technology insights, security, portfolio analytics, and executive engineering reports."
          />

          {github.repository && github.analytics ? (
            <RepositoryIntelligence
              repository={github.repository}
              analytics={github.analytics}
            />
          ) : null}


          <section className="space-y-8 pt-8">
  <div>
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
      Detailed Analytics
    </p>

    <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
      Repository Analytics
    </h2>

    <p className="mt-3 max-w-3xl text-zinc-400">
      Detailed repository metrics, visualizations, historical
      analysis, and supporting engineering data.
    </p>
  </div>

  <GithubAnalyticsSection {...github} />
</section>
        </div>
      )}
    </RepositoryAnalysisContainer>
  );
}