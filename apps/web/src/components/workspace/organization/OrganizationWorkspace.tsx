"use client";

import { OrganizationDashboard } from "@/components/github/OrganizationDashboard";
import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";

export function OrganizationWorkspace() {
  return (
    <RepositoryAnalysisContainer>
      {(github) =>
        github.analytics && (
          <OrganizationDashboard
            organization={github.analytics.organizationIntelligence}
          />
        )
      }
    </RepositoryAnalysisContainer>
  );
}