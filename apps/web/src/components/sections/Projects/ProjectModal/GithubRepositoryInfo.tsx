"use client";

import {
  CalendarDays,
  Code2,
  FolderGit2,
  Globe,
  ShieldCheck,
} from "lucide-react";

import type { ReactNode } from "react";

import type { GithubRepository } from "@/types/github";
import { GithubCard } from "./GithubCard";

interface GithubRepositoryInfoProps {
  repository: GithubRepository | null;
}

export function GithubRepositoryInfo({
  repository,
}: GithubRepositoryInfoProps) {
  if (!repository) {
    return null;
  }

  return (
    <GithubCard>
      <div className="mb-8">
  <h3 className="text-2xl font-bold text-white">
    Repository Overview
  </h3>

  <p className="mt-2 text-sm text-zinc-400">
    Core repository metadata and activity.
  </p>
</div>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard
          icon={<Code2 className="h-5 w-5" />}
          label="Primary Language"
          value={
            repository.language ??
            "Not specified"
          }
        />

        <InfoCard
          icon={<FolderGit2 className="h-5 w-5" />}
          label="Default Branch"
          value={repository.default_branch}
        />

        <InfoCard
          icon={<Globe className="h-5 w-5" />}
          label="Visibility"
          value={repository.visibility}
        />

        <InfoCard
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Open Issues"
          value={repository.open_issues_count.toString()}
        />

        <InfoCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Last Updated"
          value={new Date(
            repository.updated_at,
          ).toLocaleDateString()}
        />

        <InfoCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Last Push"
          value={new Date(
            repository.pushed_at,
          ).toLocaleDateString()}
        />
      </div>

      {repository.description && (
        <div className="mt-10">
          <h4 className="mb-3 text-lg font-semibold text-white">
            Description
          </h4>

          <p className="leading-8 text-zinc-400">
            {repository.description}
          </p>
        </div>
      )}

      {repository.topics?.length ? (
        <div className="mt-10">
          <h4 className="mb-3 text-lg font-semibold text-white">
            Topics
          </h4>

          <div className="flex flex-wrap gap-3">
            {repository.topics.map((topic) => (
              <span
                key={topic}
                className="
rounded-full
border
border-white/10
bg-white/5
px-4
py-2
text-sm
font-medium
text-cyan-300
transition-all
duration-300
hover:border-cyan-400/40
hover:bg-cyan-500/10
"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </GithubCard>
  );
}

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function InfoCard({
  icon,
  label,
  value,
}: InfoCardProps) {
  return (
    <div
      className="
group
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-5
transition-all
duration-300
hover:border-cyan-400/40
hover:bg-cyan-500/5
"
    >
      <div className="flex items-start gap-4">

        <div
          className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-cyan-500/10
text-cyan-400
transition-transform
duration-300
group-hover:scale-110
"
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs uppercase tracking-widest text-zinc-500">
            {label}
          </p>

          <p className="mt-2 break-words text-base font-semibold text-white">
            {value}
          </p>

        </div>

      </div>
    </div>
  );
}