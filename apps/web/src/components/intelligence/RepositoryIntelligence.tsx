"use client";

import { ExecutiveIntelligence } from "./executive";
import { EngineeringIntelligence } from "./engineering";
import { TechnologyIntelligence } from "./technology";
import { DevelopmentIntelligence } from "./development";
import { EnterpriseIntelligence } from "./enterprise";
import { RecruiterIntelligence } from "./recruiter";
import { AIRecommendations } from "./recommendations";

import type {
  GithubRepository,
  RepositoryAnalytics,
} from "@/types/github";

interface RepositoryIntelligenceProps {
  repository: GithubRepository;
  analytics: RepositoryAnalytics;
}

export function RepositoryIntelligence({
  repository,
  analytics,
}: RepositoryIntelligenceProps) {
  return (
    <div className="space-y-14">
      <ExecutiveIntelligence
        repository={repository}
        analytics={analytics}
      />

      <EngineeringIntelligence
        analytics={analytics}
      />

      <TechnologyIntelligence
        analytics={analytics}
      />

      <DevelopmentIntelligence
        analytics={analytics}
      />

      <EnterpriseIntelligence
        analytics={analytics}
      />

      {analytics.recruiterIntelligence ? (
        <RecruiterIntelligence
          recruiterIntelligence={
            analytics.recruiterIntelligence
          }
        />
      ) : null}

      <AIRecommendations
        analytics={analytics}
      />
    </div>
  );
}