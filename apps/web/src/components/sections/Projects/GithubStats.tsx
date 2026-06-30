"use client";

import { GitFork, HardDrive, Eye, Star } from "lucide-react";
import type { ReactNode } from "react";

import type { GithubRepository } from "@/types/github";

interface GithubStatsProps {
  repository: GithubRepository | null;
}

export function GithubStats({
  repository,
}: GithubStatsProps) {
  if (!repository) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <h3 className="mb-8 text-2xl font-bold text-white">
        GitHub Statistics
      </h3>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard
          icon={<Star className="h-5 w-5" />}
          label="Stars"
          value={repository.stargazers_count}
        />

        <StatCard
          icon={<GitFork className="h-5 w-5" />}
          label="Forks"
          value={repository.forks_count}
        />

        <StatCard
          icon={<Eye className="h-5 w-5" />}
          label="Watchers"
          value={repository.watchers_count}
        />

        <StatCard
          icon={<HardDrive className="h-5 w-5" />}
          label="Repository Size"
          value={`${(
            repository.size / 1024
          ).toFixed(1)} MB`}
        />
      </div>
    </section>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

function StatCard({
  icon,
  label,
  value,
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
        {value}
      </p>

      <p className="mt-2 text-sm text-zinc-400">
        {label}
      </p>
    </div>
  );
}