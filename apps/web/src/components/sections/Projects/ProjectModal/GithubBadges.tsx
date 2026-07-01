"use client";

import {
  BadgeCheck,
  GitBranch,
  Globe,
  Star,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";

interface GithubBadgesProps {
  repository: GithubRepository | null;
}

export function GithubBadges({
  repository,
}: GithubBadgesProps) {
  if (!repository) return null;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <h3 className="mb-6 text-2xl font-bold text-white">
        Repository Badges
      </h3>

      <div className="flex flex-wrap gap-3">

        <Badge
          icon={<Globe size={16} />}
          text={repository.visibility}
          color="cyan"
        />

        <Badge
          icon={<GitBranch size={16} />}
          text={repository.default_branch}
          color="purple"
        />

        <Badge
          icon={<BadgeCheck size={16} />}
          text="Open Source"
          color="green"
        />

        <Badge
          icon={<Star size={16} />}
          text={`${repository.stargazers_count} Stars`}
          color="yellow"
        />

      </div>
    </section>
  );
}

interface BadgeProps {
  icon: React.ReactNode;
  text: string;
  color:
    | "cyan"
    | "purple"
    | "green"
    | "yellow";
}

function Badge({
  icon,
  text,
  color,
}: BadgeProps) {
  const colors = {
    cyan:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",

    purple:
      "border-purple-500/20 bg-purple-500/10 text-purple-300",

    green:
      "border-green-500/20 bg-green-500/10 text-green-300",

    yellow:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
  };

  return (
    <div
      className={`
        flex
        items-center
        gap-2
        rounded-full
        border
        px-4
        py-2
        text-sm
        font-medium
        ${colors[color]}
      `}
    >
      {icon}

      {text}
    </div>
  );
}