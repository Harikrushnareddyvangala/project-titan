"use client";

import {
  CalendarDays,
  GitCommitHorizontal,
  Clock3,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";
import { GithubCard } from "./GithubCard";

interface GithubTimelineProps {
  repository: GithubRepository | null;
}

export function GithubTimeline({
  repository,
}: GithubTimelineProps) {
  if (!repository) return null;

  const created = new Date(repository.created_at);
  const updated = new Date(repository.updated_at);
  const pushed = new Date(repository.pushed_at);

  const now = new Date();

  const ageMonths =
    (now.getFullYear() - created.getFullYear()) * 12 +
    (now.getMonth() - created.getMonth());

  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;

  const repositoryAge =
    years > 0
      ? `${years} year${years > 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`
      : `${months} month${months !== 1 ? "s" : ""}`;

  return (
    <GithubCard>
      <h3 className="mb-8 text-2xl font-bold text-white">
        Repository Timeline
      </h3>

      <div className="space-y-8">
        <TimelineItem
          icon={<CalendarDays size={20} />}
          title="Created"
          value={created.toLocaleDateString()}
        />

        <TimelineItem
          icon={<GitCommitHorizontal size={20} />}
          title="Last Push"
          value={pushed.toLocaleDateString()}
        />

        <TimelineItem
          icon={<Clock3 size={20} />}
          title="Last Updated"
          value={updated.toLocaleDateString()}
        />

        <TimelineItem
          icon={<Clock3 size={20} />}
          title="Repository Age"
          value={repositoryAge}
        />
      </div>
    </GithubCard>
  );
}

interface TimelineItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function TimelineItem({
  icon,
  title,
  value,
}: TimelineItemProps) {
  return (
    <div className="flex gap-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
        {icon}
      </div>

      <div>
        <p className="text-sm text-zinc-400">
          {title}
        </p>

        <p className="mt-1 font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}