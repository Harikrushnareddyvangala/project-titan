"use client";

import type {
  GithubRepository,
  RepositoryAnalytics,
} from "@/types/github";

import { IntelligenceNavigation } from "./navigation";
import { IntelligenceEmptyState, IntelligenceLoading, IntelligenceSection } from "./shared";
import { IntelligenceOverview } from "./overview";
import { IntelligenceSearch } from "./search";

import { ExecutiveIntelligence } from "./executive";
import { EngineeringIntelligence } from "./engineering";
import { TechnologyIntelligence } from "./technology";
import { DevelopmentIntelligence } from "./development";
import { EnterpriseIntelligence } from "./enterprise";
import { RecruiterIntelligence } from "./recruiter";
import { AIRecommendations } from "./recommendations";

interface RepositoryIntelligenceProps {
  repository: GithubRepository;
  analytics: RepositoryAnalytics;
}

export function RepositoryIntelligence({
  repository,
  analytics,
}: RepositoryIntelligenceProps) {
  return (
    <div className="space-y-8 sm:space-y-10">
  <IntelligenceNavigation
    analytics={analytics}
  />

  <IntelligenceSearch
    analytics={analytics}
  />

  <IntelligenceOverview
    analytics={analytics}
  />
      <div className="space-y-10 sm:space-y-14">
        <IntelligenceSection id="executive">
          <ExecutiveIntelligence
            repository={repository}
            analytics={analytics}
          />
        </IntelligenceSection>

        <IntelligenceSection id="engineering">
          <EngineeringIntelligence
            analytics={analytics}
          />
        </IntelligenceSection>

        <IntelligenceSection id="technology">
          <TechnologyIntelligence
            analytics={analytics}
          />
        </IntelligenceSection>

        <IntelligenceSection id="development">
          <DevelopmentIntelligence
            analytics={analytics}
          />
        </IntelligenceSection>

        <IntelligenceSection id="enterprise">
          <EnterpriseIntelligence
            analytics={analytics}
          />
        </IntelligenceSection>

        {analytics.recruiterIntelligence ? (
          <IntelligenceSection id="recruiter">
            <RecruiterIntelligence
              recruiterIntelligence={
                analytics.recruiterIntelligence
              }
            />
          </IntelligenceSection>
        ) : null}

        <IntelligenceSection id="recommendations">
          <AIRecommendations
            analytics={analytics}
          />
        </IntelligenceSection>
      </div>
    </div>
  );
}