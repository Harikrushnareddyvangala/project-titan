"use client";


import { RepositoryOverviewCard } from "./RepositoryOverviewCard";
import { RepositoryScore } from "./RepositoryScore";
import { RepositoryHealthRing } from "./RepositoryHealthRing";

import { GithubLanguageDonut } from "./GithubLanguageDonut";
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
  <div className="space-y-12">

    {/* Dashboard */}

    <div
      className="
      grid
      gap-10
      xl:grid-cols-[1.7fr_0.9fr]
      items-start
      "
    >

      {/* LEFT */}

      <div className="space-y-8">

        <RepositoryOverviewCard
          repository={repository}
        />

        {/* KPI */}

        <div
          className="
          grid
          gap-6
          sm:grid-cols-2
          2xl:grid-cols-4
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
            icon={<Eye className="text-violet-400" />}
            color="rgba(168,85,247,.25)"
          />

          <KpiCard
            title="Repository Size"
            value={Math.round(repository.size / 1024)}
            subtitle="MB"
            icon={<HardDrive className="text-green-400" />}
            color="rgba(34,197,94,.25)"
          />

        </div>

        <GithubLanguageDonut
  languages={languages}
/>

      </div>

      {/* RIGHT */}

      <div
        className="
        sticky
        top-28
        space-y-8
        "
      >

        <RepositoryScore
          repository={repository}
        />

        <RepositoryHealthRing
          repository={repository}
        />

        <GithubRepositoryMetadata
          repository={repository}
        />

      </div>

    </div>

    {/* FULL WIDTH */}

    <GithubCommitActivity
      commits={commits}
    />

    <GithubContributors
      contributors={contributors}
    />

  </div>
);
}