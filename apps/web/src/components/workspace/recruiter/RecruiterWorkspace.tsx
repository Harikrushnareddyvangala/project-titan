"use client";

import { WorkspaceHeader } from "@/components/workspace/shared/WorkspaceHeader";
import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";

import { RecruiterDashboard } from "@/components/github/RecruiterDashboard";
import { ExecutiveEngineeringReportDashboard } from "@/components/github/ExecutiveEngineeringReportDashboard";
import { DeveloperDashboard } from "@/components/github/DeveloperDashboard";
import { CareerDashboard } from "@/components/github/CareerDashboard";

export function RecruiterWorkspace() {
  return (
    <RepositoryAnalysisContainer>
      {(github) =>
        github.analytics && (
          <div className="space-y-14">
            <WorkspaceHeader
              title="Recruiter Workspace"
              description="Evaluate engineering talent using Project TITAN's AI-powered recruiter intelligence, technical assessment, and career insights."
            />

            <RecruiterDashboard
              recruiter={github.analytics.recruiterIntelligence}
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
          </div>
        )
      }
    </RepositoryAnalysisContainer>
  );
}