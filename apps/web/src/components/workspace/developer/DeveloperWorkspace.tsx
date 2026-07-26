"use client";

import { CareerDashboard } from "@/components/github/CareerDashboard";
import { DeveloperDashboard } from "@/components/github/DeveloperDashboard";
import { EngineeringMentorDashboard } from "@/components/github/EngineeringMentorDashboard";
import { RepositoryAnalysisContainer } from "@/components/workspace/shared/RepositoryAnalysisContainer";

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
          </div>
        )
      }
    </RepositoryAnalysisContainer>
  );
}