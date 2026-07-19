"use client";
import { motion } from "framer-motion";
import type {
  GithubLanguages,
  GithubRepository,
  GithubCommitWeek,
  GithubContributor,
  RepositoryAnalytics,
} from "@/types/github";

import { AnalyticsHeader } from "./GithubAnalytics/AnalyticsHeader";
import { AnalyticsSidebar } from "./GithubAnalytics/AnalyticsSidebar";
import { DashboardGrid,} from "./GithubAnalytics/DashboardGrid";
import { ExecutiveSummaryHero } from "./GithubAnalytics/ExecutiveSummaryHero";
import { RepositoryAssessment } from "./GithubAnalytics/RepositoryAssessment";
import { RepositoryTimeline } from "./GithubAnalytics/RepositoryTimeline";
import { RepositoryInsights } from "./GithubAnalytics/RepositoryInsights";
import { RepositoryRecommendations } from "./GithubAnalytics/RepositoryRecommendations";
import { EngineeringScoreDashboard } from "./GithubAnalytics/EngineeringScoreDashboard";
import { RepositoryRiskAssessment } from "./GithubAnalytics/RepositoryRiskAssessment";
import { AIEngineeringRecommendations } from "./GithubAnalytics/AIEngineeringRecommendations";
import { GithubAnalyticsSkeleton } from "./GithubAnalytics/GithubAnalyticsSkeleton";
import { LanguageAnalytics } from "./GithubAnalytics/LanguageAnalytics";
import { ContributorAnalytics } from "./GithubAnalytics/ContributorAnalytics";
import { CommitActivityAnalytics } from "./GithubAnalytics/CommitActivityAnalytics";
import { RepositoryHealthDashboard } from "./GithubAnalytics/RepositoryHealthDashboard";
import { TechnologyStackAnalysis } from "./GithubAnalytics/TechnologyStackAnalysis";
import { RepositoryComplexityAnalysis } from "./GithubAnalytics/RepositoryComplexityAnalysis";
import { ArchitectureDetection } from "./GithubAnalytics/ArchitectureDetection";
import { RepositoryMaturityAssessment } from "./GithubAnalytics/RepositoryMaturityAssessment";
import { AIExecutiveEngineeringReport } from "./GithubAnalytics/AIExecutiveEngineeringReport";
import { TechnologyStackAnalytics } from "./GithubAnalytics/TechnologyStackAnalytics";
import { RepositorySecurityAnalysis } from "./GithubAnalytics/RepositorySecurityAnalysis"; 
import { RepositoryDevOpsAnalysis } from "./GithubAnalytics/RepositoryDevOpsAnalysis";   
import { RepositoryCodeQualityAnalysis } from "./GithubAnalytics/RepositoryCodeQualityAnalysis";
import { RepositoryPerformanceAnalysis } from "./GithubAnalytics/RepositoryPerformanceAnalysis";
import { RepositoryRadarChart } from "./GithubAnalytics/RepositoryRadarChart";
import { RepositoryScoreTimeline } from "./GithubAnalytics/RepositoryScoreTimeline";
import { TechnologyDependencyGraph } from "./GithubAnalytics/TechnologyDependencyGraph";
import { RepositoryActivityHeatmap } from "./GithubAnalytics/RepositoryActivityHeatmap";
interface GithubAnalyticsSectionProps {
  repository: GithubRepository | null;
  analytics: RepositoryAnalytics | null;
  languages: GithubLanguages;
  commitActivity: GithubCommitWeek[];
  contributors: GithubContributor[];
  loading: boolean;
}

export function GithubAnalyticsSection({
  repository,
  analytics,
  languages,
  commitActivity,
  contributors,
  loading,
}: GithubAnalyticsSectionProps) {
  if (loading) {
    return <GithubAnalyticsSkeleton />;
}

  if (!repository) {
    return <div className="p-10 text-center text-zinc-400">No Repository</div>;
  }
  
  return (
//   <section
// className="
// relative
// overflow-hidden
// rounded-[40px]
// bg-gradient-to-br
// from-zinc-950
// via-zinc-900
// to-black
// p-10
// text-white
// space-y-10
// "
// >
//   {/* Background Glow */}

// <motion.div
// className="
// absolute
// -left-44
// -top-44
// h-[520px]
// w-[520px]
// rounded-full
// bg-cyan-500/10
// blur-[180px]
// "
// animate={{
// scale:[1,1.2,1],
// opacity:[.2,.5,.2],
// }}
// transition={{
// duration:18,
// repeat:Infinity,
// }}
// />

// <motion.div
// className="
// absolute
// -right-52
// -bottom-0
// h-[420px]
// w-[420px]
// rounded-full
// bg-violet-500/10
// blur-[180px]
// "
// animate={{
// scale:[1,1.15,1],
// opacity:[.2,.45,.2],
// }}
// transition={{
// duration:20,
// repeat:Infinity,
// }}
// />
// />
//   </section>
<section>

<AnalyticsHeader />

<div
className="
h-px
w-full
bg-gradient-to-r
from-transparent
via-cyan-400/40
to-transparent
"
/>

<div className="mt-10 grid grid-cols-12 gap-8">

    <div className="hidden xl:block xl:col-span-3">

        <AnalyticsSidebar/>

    </div>

    <div className="col-span-12 xl:col-span-9">

<ExecutiveSummaryHero
repository={repository}
languages={languages}
analytics={analytics}
/>
<EngineeringScoreDashboard
repository={repository}
analytics={analytics}
/>
<RepositoryRiskAssessment 
repository={repository} 
analytics={analytics}
/>
<AIEngineeringRecommendations 
repository={repository} 
analytics={analytics}
/>
<RepositoryAssessment
repository={repository}
analytics={analytics}
/>
<DashboardGrid
repository={repository}
analytics={analytics}
languages={languages}
commits={commitActivity}
contributors={contributors}
/>
<RepositoryInsights
repository={repository}
analytics={analytics}
/>
<RepositoryRecommendations
repository={repository}
analytics={analytics}
/>
<ArchitectureDetection
repository={repository}
languages={languages}
/>
<TechnologyStackAnalytics
repository={repository}
languages={languages}
/>
<RepositoryComplexityAnalysis
repository={repository}
languages={languages}
analytics={analytics}
/>
<TechnologyDependencyGraph
    repository={repository}
    languages={languages}
/>
<RepositorySecurityAnalysis
repository={repository}
analytics={analytics}
/>
<RepositoryDevOpsAnalysis
repository={repository}
languages={languages}
/>
<RepositoryCodeQualityAnalysis
repository={repository}
analytics={analytics}
/>
<RepositoryPerformanceAnalysis
repository={repository}
analytics={analytics}
/>
<LanguageAnalytics
languages={languages}
/>
<ContributorAnalytics
contributors={contributors}
/>
<RepositoryTimeline
repository={repository}
/>
<RepositoryMaturityAssessment
repository={repository}
analytics={analytics}
/>
<AIExecutiveEngineeringReport
repository={repository}
analytics={analytics}
/>
<CommitActivityAnalytics
commits={commitActivity}
/>
<RepositoryHealthDashboard
repository={repository}
analytics={analytics}
/>
<RepositoryRadarChart
    analytics={analytics}
/>
<RepositoryScoreTimeline
    analytics={analytics}
/>
<RepositoryActivityHeatmap
    commits={commitActivity}
/>

  </div>

</div>

</section>
);
}