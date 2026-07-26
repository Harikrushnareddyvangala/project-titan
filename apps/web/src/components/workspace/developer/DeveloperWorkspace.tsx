"use client";

import { DeveloperDashboard } from "@/components/github/DeveloperDashboard";
import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";

export function DeveloperWorkspace() {
  return (
    <RepositoryAnalysisContainer>
      {(github) =>
        github.analytics && (
          <DeveloperDashboard
            developer={github.analytics.developerDNA}
          />
        )
      }
    </RepositoryAnalysisContainer>
  );
}