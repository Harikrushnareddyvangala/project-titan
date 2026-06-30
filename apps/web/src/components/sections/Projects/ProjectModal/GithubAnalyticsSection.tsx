"use client";

import { GithubStats } from "../GithubStats";
import { GithubLanguages } from "./GithubLanguages";
import { GithubRepositoryInfo } from "./GithubRepositoryInfo";

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
    return (
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-white">
          Project Intelligence
        </h2>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
          <p className="text-zinc-400">
            Loading GitHub repository…
          </p>
        </div>
      </section>
    );
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

      <GithubRepositoryInfo
        repository={repository}
      />

      <GithubLanguages
        languages={languages}
      />
    </section>
  );
}