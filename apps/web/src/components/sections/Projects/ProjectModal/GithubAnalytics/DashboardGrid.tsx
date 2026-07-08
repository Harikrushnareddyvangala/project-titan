"use client";

import { AnalyticsHeader } from "./AnalyticsHeader";
import { RepositoryOverviewCard } from "./RepositoryOverviewCard";
import { RepositoryScore } from "./RepositoryScore";
import { RepositoryHealthRing } from "./RepositoryHealthRing";

import { GithubLanguagesCard } from "./GithubLanguagesCard";
import { GithubCommitActivity } from "./GithubCommitActivity";
import { GithubContributors } from "./GithubContributors";
import { GithubRepositoryMetadata } from "./GithubRepositoryMetadata";

import type {
  GithubLanguages,
  GithubRepository,
  GithubCommitWeek,
  GithubContributor,
} from "@/types/github";

interface DashboardGridProps {
  repository: GithubRepository;
  languages: GithubLanguages;
  commits: GithubCommitWeek[];
  contributors: GithubContributor[];
}

export function DashboardGrid({
  repository,
  languages,
  commits,
  contributors,
}: DashboardGridProps) {
  return (
    <div className="space-y-8">

      {/* Analytics Header */}

      <AnalyticsHeader />

      {/* Main Dashboard */}

      <div
        className="
        grid
        gap-8
        xl:grid-cols-[2fr_1fr]
        "
      >

        {/* LEFT COLUMN */}

        <div className="space-y-8">

          <RepositoryOverviewCard
            repository={repository}
          />

          {/* Step 3 */}

          {/* KPI Cards */}

          {/* Step 4 */}

          <GithubLanguagesCard
            languages={languages}
          />

          {/* Step 5 */}

          <GithubCommitActivity
            commits={commits}
          />

          {/* Step 6 */}

          <GithubContributors
            contributors={contributors}
          />

        </div>

        {/* RIGHT COLUMN */}

        <div className="space-y-8">

          {/* Step 3 */}

          <RepositoryScore
            repository={repository}
          />

          <RepositoryHealthRing
            repository={repository}
          />

          {/* Step 7 */}

          <GithubRepositoryMetadata
            repository={repository}
          />

        </div>

      </div>

    </div>
  );
}