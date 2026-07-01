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
      <h3 className="mb-8 text-2xl font-bold text-white">
        Repository Information
      </h3>

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
          <h4 className="mb-3 text-lg font-semibold text-cyan-400">
            Description
          </h4>

          <p className="leading-8 text-zinc-300">
            {repository.description}
          </p>
        </div>
      )}

      {repository.topics?.length ? (
        <div className="mt-10">
          <h4 className="mb-3 text-lg font-semibold text-cyan-400">
            Topics
          </h4>

          <div className="flex flex-wrap gap-3">
            {repository.topics.map((topic) => (
              <span
                key={topic}
                className="
                  rounded-full
                  border
                  border-cyan-500/30
                  bg-cyan-500/10
                  px-4
                  py-2
                  text-sm
                  text-cyan-300
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
        flex
        items-start
        gap-4
        rounded-2xl
        border
        border-white/10
        bg-black/20
        p-5
      "
    >
      <div className="text-cyan-400">
        {icon}
      </div>

      <div>
        <p className="text-sm text-zinc-400">
          {label}
        </p>

        <p className="mt-1 font-medium text-white">
          {value}
        </p>
      </div>
    </div>
  );
}