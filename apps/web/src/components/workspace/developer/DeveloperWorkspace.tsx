"use client";

import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";

import { DeveloperDashboard } from "@/components/github/DeveloperDashboard";
import { CareerDashboard } from "@/components/github/CareerDashboard";
import { EngineeringMentorDashboard } from "@/components/github/EngineeringMentorDashboard";
import { TeamCompatibilityDashboard } from "@/components/github/TeamCompatibilityDashboard";

export function DeveloperWorkspace() {
  return (
    <RepositoryAnalysisContainer>
      {(github) =>
        github.analytics && (
          <div className="space-y-12">
            <DeveloperDashboard
              developer={github.analytics.developerDNA}
            />

            <CareerDashboard
              career={github.analytics.careerIntelligence}
            />

            <EngineeringMentorDashboard
              analytics={github.analytics}
            />

            <TeamCompatibilityDashboard
              analytics={github.analytics}
            />
          </div>
        )
      }
    </RepositoryAnalysisContainer>
  );
}