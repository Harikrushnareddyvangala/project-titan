"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  GitBranch,
  Globe,
  Star,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";
import { GithubCard } from "./GithubCard";

interface GithubBadgesProps {
  repository: GithubRepository | null;
}

export function GithubBadges({
  repository,
}: GithubBadgesProps) {
  if (!repository) return null;

  return (
    <GithubCard>
      <div className="mb-8">

  <h3 className="text-2xl font-bold text-white">
    Repository Badges
  </h3>

  <p className="mt-2 text-zinc-400">
    Automatically generated repository achievements.
  </p>

</div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

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
    </GithubCard>
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
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.03,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`
group
relative
overflow-hidden
rounded-3xl
border
p-6
transition-all
duration-300
${colors[color]}
`}
    >
      <div
        className="
absolute
inset-0
bg-gradient-to-br
from-white/5
via-transparent
to-white/5
opacity-0
transition-opacity
duration-500
group-hover:opacity-100
"
      />

      <div className="relative z-10">

        <div
          className="
mb-5
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-white/10
"
        >
          {icon}
        </div>

        <p className="font-semibold">
          {text}
        </p>

      </div>

    </motion.div>
  );
}