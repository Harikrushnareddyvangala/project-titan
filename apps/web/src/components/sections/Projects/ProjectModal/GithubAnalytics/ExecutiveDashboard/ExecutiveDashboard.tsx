"use client";

import type { RepositoryAnalytics } from "@/types/github";

import { ExecutiveSummaryCard } from "./ExecutiveSummaryCard";
import { EngineeringScoreCard } from "./EngineeringScoreCard";
import { TechnologyStackCard } from "./TechnologyStackCard";
import { RiskAssessmentCard } from "./RiskAssessmentCard";
import { HiringSignalCard } from "./HiringSignalCard";

interface ExecutiveDashboardProps {
  analytics: RepositoryAnalytics | null;
}

export function ExecutiveDashboard({
  analytics,
}: ExecutiveDashboardProps) {
  if (!analytics) return null;

  return (
    <section className="mt-10 space-y-8">

  <ExecutiveSummaryCard
    analytics={analytics}
  />

  <div className="grid gap-8 lg:grid-cols-2">

    <EngineeringScoreCard
      analytics={analytics}
    />

    <TechnologyStackCard
      analytics={analytics}
    />
    <RiskAssessmentCard
    analytics={analytics}
  />

  <HiringSignalCard
    analytics={analytics}
  />

  </div>

</section>
  );
}