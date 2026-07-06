"use client";

import { motion } from "framer-motion";



import type { GithubRepository } from "@/types/github";
import { GithubCard } from "./GithubCard";
import {
  Activity,
  CalendarClock,
  Globe,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock3,
} from "lucide-react";

import { RepositoryHealthRing } from "./GithubAnalytics/RepositoryHealthRing";

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

  const healthScore =
  Math.max(
    25,
    100 -
      daysSinceUpdate / 2 -
      repository.open_issues_count,
  );

const maintenanceStatus =
  healthScore > 80
    ? "Excellent"

    : healthScore > 60
      ? "Healthy"

      : "Needs Attention";

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

      <div
  className="
    grid
    gap-8
    xl:grid-cols-[330px_1fr]
  "
>

  <RepositoryHealthRing
    score={Math.round(
      healthScore,
    )}
  />

  <div className="grid gap-6 md:grid-cols-2">
        <HealthItem
  icon={
    active
      ? (
          <CheckCircle2
            size={20}
          />
        )
      : (
          <AlertTriangle
            size={20}
          />
        )
  }
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
          icon={<Clock3 size={20} />}
          label="Last Updated"
          value={`${daysSinceUpdate} days ago`}
          color="text-purple-400"
        />

        <HealthItem
          icon={<Wrench size={20} />}
          label="Maintenance"
          value={maintenanceStatus}
          color={
            active
              ? "text-green-400"
              : "text-yellow-400"
          }
        />
      </div>
      </div>
      <motion.div
  initial={{
    opacity: 0,
  }}
  whileInView={{
    opacity: 1,
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
  <div className="flex items-center justify-between">

    <span className="text-zinc-400">
      Repository Health Score
    </span>

    <span
      className="
        text-xl
        font-bold
        text-cyan-300
      "
    >
      {Math.round(
        healthScore,
      )}
      %
    </span>

  </div>
</motion.div>
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