"use client";

import { motion } from "framer-motion";

import {
  Sparkles,
  Star,
  GitFork,
  Activity,
  Clock3,
} from "lucide-react";

import type {
  GithubRepository,
  GithubLanguages,
} from "@/types/github";

interface ExecutiveSummaryHeroProps {
  repository: GithubRepository;
  languages: GithubLanguages;
}

export function ExecutiveSummaryHero({
  repository,
  languages,
}: ExecutiveSummaryHeroProps) {
  const primaryLanguage =
    Object.entries(languages)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "Unknown";

  const score =
    Math.min(
      100,
      Math.round(
        repository.stargazers_count * 2 +
          repository.forks_count * 3 +
          repository.watchers_count,
      ),
    );

  const updated =
    new Date(repository.updated_at);

  const days =
    Math.floor(
      (Date.now() - updated.getTime()) /
        (1000 * 60 * 60 * 24),
    );

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        relative
        overflow-hidden
        rounded-[40px]
        border
        border-white/10
        bg-gradient-to-br
        from-cyan-500/10
        via-blue-500/5
        to-transparent
        p-8
      "
    >
      <div
        className="
          absolute
          right-0
          top-0
          h-80
          w-80
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
      />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <Sparkles
            className="
              text-cyan-400
            "
          />

          <span
            className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-cyan-300
            "
          >
            Executive Summary
          </span>

        </div>

        <h2
          className="
            mt-4
            text-4xl
            font-bold
            text-white
          "
        >
          {repository.name}
        </h2>

        <p
          className="
            mt-4
            max-w-3xl
            text-zinc-300
            leading-8
          "
        >
          This repository demonstrates
          strong engineering practices,
          active maintenance and measurable
          community engagement with a
          repository score of {score}/100.
        </p>

        <div
          className="
            mt-10
            grid
            gap-4
            md:grid-cols-5
          "
        >
          <MetricCard
            icon={<Activity size={18} />}
            label="Score"
            value={`${score}/100`}
          />

          <MetricCard
            icon={<Star size={18} />}
            label="Stars"
            value={repository.stargazers_count.toString()}
          />

          <MetricCard
            icon={<GitFork size={18} />}
            label="Forks"
            value={repository.forks_count.toString()}
          />

          <MetricCard
            icon={<Sparkles size={18} />}
            label="Language"
            value={primaryLanguage}
          />

          <MetricCard
            icon={<Clock3 size={18} />}
            label="Updated"
            value={`${days}d ago`}
          />
        </div>

      </div>

    </motion.section>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-cyan-400
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-3
          text-xs
          uppercase
          tracking-wider
          text-zinc-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-xl
          font-semibold
          text-white
        "
      >
        {value}
      </p>
    </div>
  );
}