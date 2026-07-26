"use client";

import { GithubAnalyticsSection } from "@/components/sections/Projects/ProjectModal/GithubAnalyticsSection";
import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";

export function RepositoryWorkspace() {
  return (
    <RepositoryAnalysisContainer>
      {(github) => (
        <GithubAnalyticsSection {...github} />
      )}
    </RepositoryAnalysisContainer>
  );
}