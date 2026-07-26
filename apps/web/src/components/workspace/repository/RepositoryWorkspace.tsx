"use client";

import { WorkspaceHeader } from "@/components/workspace/shared/WorkspaceHeader";
import { GithubAnalyticsSection } from "@/components/sections/Projects/ProjectModal/GithubAnalyticsSection";
import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";

export function RepositoryWorkspace() {
  return (
    <RepositoryAnalysisContainer>
      {(github) => (
        <div className="space-y-14">
          <WorkspaceHeader
            title="Repository Workspace"
            description="Explore comprehensive repository intelligence including engineering quality, contributors, technology insights, security, portfolio analytics, and executive engineering reports."
          />

          <GithubAnalyticsSection {...github} />
        </div>
      )}
    </RepositoryAnalysisContainer>
  );
}