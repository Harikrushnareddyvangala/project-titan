"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import {
  CalendarDays,
  GitCommitHorizontal,
  Clock3,
  Rocket,
  Sparkles,
  History,
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
  const daysSincePush = Number.isFinite(pushed.getTime())
  ? Math.floor(
      (now.getTime() - pushed.getTime()) /
      (1000 * 60 * 60 * 24)
    )
  : 0;

const activityScore = Math.max(
  0,
  Math.min(100, 100 - daysSincePush / 3),
);

const activityLabel =
  activityScore > 80
    ? "Highly Active"
    : activityScore > 60
      ? "Active"
      : "Low Activity";
  return (
    <GithubCard>
      <div className="mb-10">

  <div className="flex items-center justify-between">

    <div>

      <h3 className="text-2xl font-bold text-white">
        Repository Timeline
      </h3>

      <p className="mt-2 text-zinc-400">
        Repository lifecycle & activity history
      </p>

    </div>

    <div
      className="
        rounded-full
        border
        border-cyan-500/20
        bg-cyan-500/10
        px-4
        py-2
        text-sm
        font-semibold
        text-cyan-300
      "
    >
      {activityLabel}
    </div>

  </div>

</div>

      <div className="relative space-y-8">

  <div
    className="
absolute
left-[22px]
top-0
bottom-0
w-px
bg-gradient-to-b
from-cyan-400/50
via-cyan-400/20
to-transparent
"
  />
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
  icon={<Rocket size={20} />}
  title="Development Activity"
  value={`${Math.round(activityScore)}%`}
 />

        <TimelineItem
          icon={<Clock3 size={20} />}
          title="Last Updated"
          value={updated.toLocaleDateString()}
        />

        <TimelineItem
          icon={<History size={20} />}
title="Repository Age"
          value={repositoryAge}
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
  className="
    mt-10
    rounded-2xl
    border
    border-white/10
    bg-white/[0.03]
    p-5
  "
>

  <div className="flex items-center gap-3">

    <Sparkles
      size={20}
      className="text-cyan-400"
    />

    <div>

      <p className="font-semibold text-white">
        Repository Insights
      </p>

      <p className="mt-1 text-sm text-zinc-400">
        Repository has been active for{" "}
        <span className="font-semibold text-cyan-300">
          {repositoryAge}
        </span>
        {" "}and currently maintains an activity score of{" "}
        <span className="font-semibold text-cyan-300">
          {Math.round(activityScore)}%
        </span>.
      </p>

    </div>

  </div>

</motion.div>
    </GithubCard>
  );
}

interface TimelineItemProps {
  icon: ReactNode;
  title: string;
  value: string;
}

function TimelineItem({
  icon,
  title,
  value,
}: TimelineItemProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -30,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
      }}
      whileHover={{
  x: 10,
  scale: 1.015,
}}
      transition={{
        duration: 0.35,
      }}
      className="
group
relative
flex
gap-6
"
    >
      <div
        className="
relative
z-10
flex
h-11
w-11
shrink-0
items-center
justify-center
rounded-full
border
border-cyan-500/30
bg-cyan-500/10
text-cyan-400
backdrop-blur-xl
transition-all
duration-300
group-hover:scale-110
group-hover:border-cyan-400
group-hover:shadow-[0_0_20px_rgba(34,211,238,.45)]
"
      >
        {icon}
      </div>

      <div
        className="
flex-1
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-5
transition-all
duration-300
group-hover:border-cyan-400/30
group-hover:bg-cyan-500/[0.03]
"
      >
        <p className="text-sm text-zinc-500">
          {title}
        </p>

        <p className="mt-2 text-lg font-semibold text-white">
          {value}
        </p>
      </div>
    </motion.div>
  );
}