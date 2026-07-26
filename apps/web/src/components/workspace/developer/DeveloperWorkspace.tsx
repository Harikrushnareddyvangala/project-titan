"use client";

import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";

import { DeveloperDashboard } from "@/components/github/DeveloperDashboard";
import { CareerDashboard } from "@/components/github/CareerDashboard";
import { EngineeringMentorDashboard } from "@/components/github/EngineeringMentorDashboard";
import { TeamCompatibilityDashboard } from "@/components/github/TeamCompatibilityDashboard";
import { ExecutiveEngineeringReportDashboard } from "@/components/github/ExecutiveEngineeringReportDashboard";
import { OrganizationIntelligenceDashboard } from "@/components/github/OrganizationIntelligenceDashboard";
import { WorkspaceHeader } from "@/components/workspace/shared/WorkspaceHeader";


export function DeveloperWorkspace() {
  return (
    <RepositoryAnalysisContainer>
      {(github) =>
        github.analytics && (
          <div className="space-y-14">

    <WorkspaceHeader

        title="Developer Workspace"

        description="Your personal engineering intelligence workspace powered by Project TITAN. Review your engineering profile, career growth, collaboration readiness, and AI recommendations."

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

        <DeveloperDashboard
            developer={github.analytics.developerDNA}
        />

        <CareerDashboard
            career={github.analytics.careerIntelligence}
        />

    </div>

    <EngineeringMentorDashboard
        analytics={github.analytics}
    />
    

    <div
        className="
        grid
        gap-10
        xl:grid-cols-2
        "
    >

        <TeamCompatibilityDashboard
            analytics={github.analytics}
        />

        <OrganizationIntelligenceDashboard
            analytics={github.analytics}
        />

    </div>

</div>
        )
      }
    </RepositoryAnalysisContainer>
  );
}