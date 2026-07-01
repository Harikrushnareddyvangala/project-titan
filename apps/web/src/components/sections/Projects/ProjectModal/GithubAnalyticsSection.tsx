"use client";

import { GithubStats } from "../GithubStats";
import { GithubLanguages } from "./GithubLanguages";
import { GithubRepositoryInfo } from "./GithubRepositoryInfo";
import {GithubSkeleton} from "./GithubSkeleton";
import { GithubHealth } from "./GithubHealth";
import { GithubTimeline } from "./GithubTimeline";

import type {
  GithubLanguages as GithubLanguagesType,
  GithubRepository,
} from "@/types/github";

interface GithubAnalyticsSectionProps {
  repository: GithubRepository | null;
  languages: GithubLanguagesType;
  loading: boolean;
}

export function GithubAnalyticsSection({
  repository,
  languages,
  loading,
}: GithubAnalyticsSectionProps) {
  if (loading) {
  return <GithubSkeleton />;
}

  if (!repository) {
    return null;
  }

  return (
    <section className="space-y-10">
      <h2 className="text-3xl font-bold text-white">
        Project Intelligence
      </h2>

      <div className="space-y-10">
  <GithubStats
    repository={repository}
  />

  <div className="grid gap-8 xl:grid-cols-2">
    <GithubHealth
      repository={repository}
    />

    <GithubTimeline
      repository={repository}
    />
  </div>

  <GithubRepositoryInfo
    repository={repository}
  />

  <GithubLanguages
    languages={languages}
  />
</div>
    </section>
  );
}