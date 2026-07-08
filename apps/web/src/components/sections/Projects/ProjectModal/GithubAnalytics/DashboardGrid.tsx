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

import {
    Star,
    GitFork,
    Eye,
    HardDrive,
} from "lucide-react";

import { KpiCard } from "./KpiCard";

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
          <div
    className="
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
    "
>

    <KpiCard
        title="Stars"
        value={repository.stargazers_count}
        icon={<Star className="text-yellow-400" />}
        color="rgba(250,204,21,.25)"
    />

    <KpiCard
        title="Forks"
        value={repository.forks_count}
        icon={<GitFork className="text-cyan-400" />}
        color="rgba(34,211,238,.25)"
    />

    <KpiCard
        title="Watchers"
        value={repository.watchers_count}
        icon={<Eye className="text-purple-400" />}
        color="rgba(168,85,247,.25)"
    />

    <KpiCard
        title="Repository Size"
        value={`${(
            repository.size / 1024
        ).toFixed(1)} MB`}
        icon={<HardDrive className="text-green-400" />}
        color="rgba(34,197,94,.25)"
    />

</div>

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