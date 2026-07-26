"use client";

import { RecruiterDashboard } from "@/components/github/RecruiterDashboard";
import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";

export function RecruiterWorkspace() {
  return (
    <RepositoryAnalysisContainer>
      {(github) =>
        github.analytics && (
          <RecruiterDashboard
            recruiter={github.analytics.recruiterIntelligence}
          />
        )
      }
    </RepositoryAnalysisContainer>
  );
}