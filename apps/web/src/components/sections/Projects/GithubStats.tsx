"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import {
  Star,
  GitFork,
  Eye,
  HardDrive,
  AlertCircle,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";

import { AnalyticsHeader } from "./ProjectModal/GithubAnalytics/AnalyticsHeader";
import { KpiCard } from "./ProjectModal/GithubAnalytics/KpiCard";
import { RepositoryHealthRing } from "./ProjectModal/GithubAnalytics/RepositoryHealthRing";
import { RepositoryScore } from "./ProjectModal/GithubAnalytics/RepositoryScore";
import {AnimatedCounter} from "./ProjectModal/GithubAnalytics/AnimatedCounter";

interface GithubStatsProps {
  repository: GithubRepository | null;
}

function calculateHealth(
  repository: GithubRepository,
) {
  let score = 50;

  score += Math.min(
    repository.stargazers_count / 10,
    15,
  );

  score += Math.min(
    repository.forks_count / 5,
    10,
  );

  score += Math.min(
    repository.watchers_count / 8,
    8,
  );

  const updated =
    new Date(repository.updated_at);

  const days =
    (Date.now() -
      updated.getTime()) /
    (1000 * 60 * 60 * 24);

  if (days < 30)
    score += 10;

  else if (days < 90)
    score += 5;

  score -= Math.min(
    repository.open_issues_count,
    10,
  );

  return Math.max(
    0,
    Math.min(
      Math.round(score),
      100,
    ),
  );
}

export function GithubStats({
  repository,
}: GithubStatsProps) {
  if (!repository) {
    return null;
  }

  const health =
    calculateHealth(repository);
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.6,
      }}
      className="
        space-y-8
      "
    >
      <AnalyticsHeader
        repository={repository}
      />

      <div
        className="
          grid
          gap-6
          xl:grid-cols-4
          md:grid-cols-2
        "
      >
        <KpiCard
          title="Stars"
          value={repository.stargazers_count}
          icon={<Star size={22} />}
        />

        <KpiCard
          title="Forks"
          value={repository.forks_count}
          icon={<GitFork size={22} />}
          
        />

        <KpiCard
          title="Watchers"
          value={repository.watchers_count}
          icon={<Eye size={22} />}
          
        />

        <KpiCard
          title="Repository Size"
          value={Number(
            (
              repository.size / 1024
            ).toFixed(1),
          )}
          suffix=" MB"
          decimals={1}
          icon={<HardDrive size={22} />}
          
        />
      </div>

      <div
        className="
          grid
          gap-8
          xl:grid-cols-2
        "
      >
        <RepositoryHealthRing
          score={health}
        />

        <RepositoryScore
          repository={repository}
        />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.25,
        }}
        className="
          rounded-[34px]
          border
          border-white/10
          bg-white/[0.05]
          backdrop-blur-3xl
          p-8
        "
      >
        <div className="flex items-center gap-3">

          <AlertCircle
            className="text-cyan-400"
            size={22}
          />

          <h3 className="text-lg font-semibold text-white">
            Repository Summary
          </h3>

        </div>

        <p
          className="
            mt-6
            text-[15px]
            leading-8
            text-zinc-400
          "
        >
          This repository currently has{" "}
          <span className="font-semibold text-white">
            {repository.stargazers_count}
          </span>{" "}
          stars,
          {" "}
          <span className="font-semibold text-white">
            {repository.forks_count}
          </span>{" "}
          forks and{" "}
          <span className="font-semibold text-white">
            {repository.watchers_count}
          </span>{" "}
          watchers.

          {" "}It was last updated on{" "}

          <span className="font-semibold text-white">
            {new Date(
              repository.updated_at,
            ).toLocaleDateString()}
          </span>

          {" "}and currently contains{" "}

          <span className="font-semibold text-white">
            {repository.open_issues_count}
          </span>{" "}
          open issues.
        </p>
      </motion.div>
    </motion.section>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  delay?: number;
  decimals?: number;
  suffix?: string;
}

function StatCard({
  icon,
  label,
  value,
  delay = 0,
  decimals = 0,
  suffix = "",
}: StatCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-black/20
        p-5
        transition-all
        duration-300
        hover:border-cyan-500/40
        hover:bg-cyan-500/5
      "
    >
      <div className="mb-4 text-cyan-400">
        {icon}
      </div>

      <p className="text-3xl font-bold text-white">
        <AnimatedCounter value={value} />
      </p>

      <p className="mt-2 text-sm text-zinc-400">
        {label}
      </p>
    </div>
  );
}