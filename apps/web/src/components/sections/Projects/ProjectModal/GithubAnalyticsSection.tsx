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

      <GithubStats
  repository={repository}
/>

<GithubHealth
  repository={repository}
/>

<GithubTimeline
  repository={repository}
/>

<GithubRepositoryInfo
  repository={repository}
/>

<GithubLanguages
  languages={languages}
/>
    </section>
  );
}