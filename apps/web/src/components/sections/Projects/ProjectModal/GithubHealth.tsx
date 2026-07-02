"use client";

import { motion } from "framer-motion";

import {
  Activity,
  CalendarClock,
  Globe,
  Wrench,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";
import { GithubCard } from "./GithubCard";

interface GithubHealthProps {
  repository: GithubRepository | null;
}

export function GithubHealth({
  repository,
}: GithubHealthProps) {
  if (!repository) return null;

  const lastUpdated = new Date(repository.updated_at);

  const daysSinceUpdate = Math.floor(
    (Date.now() - lastUpdated.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const active =
    daysSinceUpdate <= 90;

  return (
    <GithubCard>
      <div className="mb-8">

  <h3 className="text-2xl font-bold text-white">
    Repository Health
  </h3>

  <p className="mt-2 text-zinc-400">
    Overall activity and maintenance indicators.
  </p>

</div>

      <div className="grid gap-6 md:grid-cols-2">
        <HealthItem
          icon={<Activity size={20} />}
          label="Development"
          value={
            active
              ? "Active"
              : "Inactive"
          }
          color={
            active
              ? "text-green-400"
              : "text-yellow-400"
          }
        />

        <HealthItem
          icon={<Globe size={20} />}
          label="Visibility"
          value={repository.visibility}
          color="text-cyan-400"
        />

        <HealthItem
          icon={<CalendarClock size={20} />}
          label="Last Updated"
          value={`${daysSinceUpdate} days ago`}
          color="text-purple-400"
        />

        <HealthItem
          icon={<Wrench size={20} />}
          label="Maintenance"
          value={
            active
              ? "Maintained"
              : "Needs attention"
          }
          color={
            active
              ? "text-green-400"
              : "text-yellow-400"
          }
        />
      </div>
    </GithubCard>
  );
}

interface HealthItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function HealthItem({
  icon,
  label,
  value,
  color,
}: HealthItemProps) {
  return (
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
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
group
relative
overflow-hidden
rounded-3xl
border
border-white/10
bg-gradient-to-br
from-white/[0.04]
to-white/[0.02]
p-6
transition-all
duration-300
hover:border-cyan-400/30
"
    >
      <div
        className="
absolute
inset-0
bg-gradient-to-br
from-cyan-500/5
via-transparent
to-blue-500/5
opacity-0
transition-opacity
duration-500
group-hover:opacity-100
"
      />

      <div className="relative z-10 flex items-start gap-5">

        <div
          className={`
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-white/5
${color}
`}
        >
          {icon}
        </div>

        <div className="flex-1">

          <p className="text-sm text-zinc-500">
            {label}
          </p>

          <p
            className={`
mt-2
text-lg
font-semibold
${color}
`}
          >
            {value}
          </p>

        </div>

      </div>
    </motion.div>
  );
}