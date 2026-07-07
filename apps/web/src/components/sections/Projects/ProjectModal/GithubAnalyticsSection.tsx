"use client";

import type {
  GithubLanguages,
  GithubRepository,
  GithubCommitWeek,
  GithubContributor,
} from "@/types/github";

import { GithubStats } from "../GithubStats";
import { GithubBadges } from "./GithubBadges";
import { GithubHealth } from "./GithubHealth";
import { GithubTimeline } from "./GithubTimeline";
import { GithubLanguagesCard } from "./GithubAnalytics/GithubLanguagesCard";
import { GithubCommitActivity } from "./GithubAnalytics/GithubCommitActivity";
import { GithubRepositoryMetadata } from "./GithubAnalytics/GithubRepositoryMetadata";
import { GithubContributors } from "./GithubAnalytics/GithubContributors";

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
    return <div>Loading...</div>;
  }

  if (!repository) {
    return <div>No Repository</div>;
  }

  return (
   <section className="p-10 bg-zinc-900 text-white space-y-8">
     <GithubStats repository={repository} />
     <GithubRepositoryMetadata
    repository={repository}
/>
     <GithubLanguagesCard
   languages={languages}
 />
    <GithubCommitActivity
    commits={commitActivity?? []}
/>
<GithubContributors
    contributors={contributors}
/>

     <GithubBadges repository={repository} />

     <GithubHealth repository={repository} />

    <GithubTimeline repository={repository} />

   </section>
 );
}