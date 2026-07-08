"use client";

import type {
  GithubLanguages,
  GithubRepository,
  GithubCommitWeek,
  GithubContributor,
} from "@/types/github";

import { AnalyticsHeader } from "./GithubAnalytics/AnalyticsHeader";
import {
  DashboardGrid,} from "./GithubAnalytics/DashboardGrid";

interface GithubAnalyticsSectionProps {
  repository: GithubRepository | null;
  languages: GithubLanguages;
  commitActivity: GithubCommitWeek[];
   contributors: GithubContributor[];
  loading: boolean;
}

export function GithubAnalyticsSection({
  repository,
  languages,
  commitActivity,
  contributors,
  loading,
}: GithubAnalyticsSectionProps) {
  if (loading) {
    return <div className="p-10 text-center text-zinc-400">Loading...</div>;
  }

  if (!repository) {
    return <div className="p-10 text-center text-zinc-400">No Repository</div>;
  }

  return (
   <section className="p-10 bg-zinc-900 text-white space-y-8">
      <AnalyticsHeader />
      <DashboardGrid
  repository={repository}
  languages={languages}
  commits={commitActivity}
  contributors={contributors}
/>
     
   </section>
 );
}