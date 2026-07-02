"use client";

import { motion } from "framer-motion";

import { GithubStats } from "../GithubStats";
import { GithubLanguages } from "./GithubLanguages";
import { GithubRepositoryInfo } from "./GithubRepositoryInfo";
import { GithubSkeleton } from "./GithubSkeleton";
import { GithubHealth } from "./GithubHealth";
import { GithubTimeline } from "./GithubTimeline";
import { GithubBadges } from "./GithubBadges";
import { RepositoryInsights } from "./RepositoryInsights";
import { DashboardBackground } from "../GithubAnalytics/DashboardBackground";

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
    <motion.section
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.6,
      }}
      className="
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-white/10
        bg-gradient-to-br
        from-zinc-950
        via-zinc-900
        to-black
        p-10
      "
    >
      <DashboardBackground />

      <div className="relative z-10 space-y-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white">
            Repository Analytics
          </h2>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Live GitHub repository health, language distribution,
            activity timeline, quality metrics, and engineering
            insights.
          </p>
        </div>

        <GithubStats repository={repository} />

        <GithubBadges repository={repository} />

        <div className="grid gap-10 xl:grid-cols-2">
          <GithubHealth repository={repository} />

          <GithubTimeline repository={repository} />
        </div>

        <div className="grid gap-10 xl:grid-cols-2">
          <GithubRepositoryInfo repository={repository} />

          <GithubLanguages languages={languages} />
        </div>

        <RepositoryInsights repository={repository} />
      </div>
    </motion.section>
  );
}