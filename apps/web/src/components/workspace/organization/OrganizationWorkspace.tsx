"use client";

import { WorkspaceHeader } from "@/components/workspace/shared/WorkspaceHeader";
import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";

import { OrganizationDashboard } from "@/components/github/OrganizationDashboard";
import { OrganizationIntelligenceDashboard } from "@/components/github/OrganizationIntelligenceDashboard";
import { ExecutiveEngineeringReportDashboard } from "@/components/github/ExecutiveEngineeringReportDashboard";
import { TeamCompatibilityDashboard } from "@/components/github/TeamCompatibilityDashboard";

export function OrganizationWorkspace() {
  return (
    <RepositoryAnalysisContainer>
      {(github) =>
        github.analytics && (
          <div className="space-y-14">
            <WorkspaceHeader
              title="Organization Workspace"
              description="Analyze engineering excellence, organizational readiness, collaboration health, and executive insights for technical leadership."
            />

            <OrganizationDashboard
              organization={github.analytics.organizationIntelligence}
            />

            <ExecutiveEngineeringReportDashboard
              analytics={github.analytics}
            />

            <div
              className="
                grid
                gap-10
                xl:grid-cols-2
              "
            >
              <OrganizationIntelligenceDashboard
                analytics={github.analytics}
              />

              <TeamCompatibilityDashboard
                analytics={github.analytics}
              />
            </div>
          </div>
        )
      }
    </RepositoryAnalysisContainer>
  );
}