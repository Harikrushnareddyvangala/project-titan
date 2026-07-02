"use client";

import { motion } from "framer-motion";
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
      <div className="mb-8">

  <h3 className="text-2xl font-bold text-white">
    Repository Timeline
  </h3>

  <p className="mt-2 text-zinc-400">
    Important milestones in the repository lifecycle.
  </p>

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
        x: 6,
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