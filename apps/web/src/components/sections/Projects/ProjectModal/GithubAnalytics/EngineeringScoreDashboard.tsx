"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  GitBranch,
  Star,
  Eye,
  Bug,
  Clock3,
} from "lucide-react";

import type { GithubRepository,RepositoryAnalytics, } from "@/types/github";
import { formatDistanceToNowStrict } from "date-fns";
import { AnimatedCounter } from "./AnimatedCounter";

interface EngineeringScoreDashboardProps {
  repository: GithubRepository | null;
  analytics: RepositoryAnalytics | null;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

export function EngineeringScoreDashboard({
  repository,
  analytics,
}: EngineeringScoreDashboardProps) {
  if (!repository) return null;

  const score =
  analytics?.engineeringScore ?? 0;

const productionScore =
  analytics?.productionScore ?? 0;

const quality =
  analytics?.quality ?? "Growing";

const deploymentReady =
  analytics?.deploymentReady ?? false;

const riskLevel =
  analytics?.riskLevel ?? "Medium";
  const grade =
  score >= 95
    ? "A+"
    : score >= 90
    ? "A"
    : score >= 80
    ? "B"
    : score >= 70
    ? "C"
    : "D";

const scoreColor =
  score >= 90
    ? "text-emerald-400"
    : score >= 80
    ? "text-cyan-400"
    : score >= 70
    ? "text-yellow-400"
    : "text-red-400";

const repositoryAge = formatDistanceToNowStrict(
    new Date(repository.created_at),
);

  

  return (
    <motion.section
    id = "engineering"
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      className="
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-3xl
        p-8
      "
    >
      <motion.div
  className="
    absolute
    -right-28
    -top-28
    h-80
    w-80
    rounded-full
    bg-cyan-500/10
    blur-[150px]
    pointer-events-none
  "
  animate={{
    scale: [1, 1.2, 1],
    opacity: [0.15, 0.4, 0.15],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
  }}
/>

<div className="relative z-10">
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Engineering Score
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Production Readiness
          </h2>

        </div>

        <motion.div
  animate={{
    rotate: [0, 8, -8, 0],
    scale: [1, 1.08, 1],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
  }}
>
  <ShieldCheck
    size={38}
    className="text-cyan-400"
  />
</motion.div>

      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">

        {/* LEFT */}

        <motion.div
  whileHover={{
    scale: 1.03,
    y: -8,
    boxShadow:
      "0 0 55px rgba(34,211,238,.18)",
  }}
          className="
            rounded-3xl
            border
            border-cyan-500/20
            bg-cyan-500/5
            p-8
            text-center
          "
        >
          <motion.div
  animate={{
    scale: [1, 1.05, 1],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
  }}
>
  <AnimatedCounter
    value={score}
    className={`text-7xl font-black ${scoreColor}`}
  />
</motion.div>
          <div className="mt-3 text-zinc-400">
            Overall Engineering Score
          </div>

          <div
  className="
    mt-6
    inline-flex
    items-center
    gap-2
    rounded-full
    border
    border-emerald-400/20
    bg-emerald-500/10
    px-5
    py-2
    text-sm
    font-semibold
    text-emerald-300
  "
>
  ★ {grade} Engineering Grade
</div>
        </motion.div>

        {/* RIGHT */}

        <motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  className="grid gap-5 sm:grid-cols-2"
>

          <MetricCard
            icon={<Star size={20} />}
            title="Stars"
            value={repository.stargazers_count}
          />

          <MetricCard
            icon={<GitBranch size={20} />}
            title="Forks"
            value={repository.forks_count}
          />

          <MetricCard
            icon={<Eye size={20} />}
            title="Watchers"
            value={repository.watchers_count}
          />

          <MetricCard
            icon={<Bug size={20} />}
            title="Open Issues"
            value={repository.open_issues_count}
          />

          <MetricCard
            icon={<Clock3 size={20} />}
            title="Repository Age"
            value={repositoryAge} 
          />

          <MetricCard
            icon={<ShieldCheck size={20} />}
            title="Visibility"
            value={repository.visibility}
          />
          <MetricCard
    icon={<ShieldCheck size={20} />}
    title="Production Score"
    value={`${productionScore}%`}
/>

<MetricCard
    icon={<ShieldCheck size={20} />}
    title="Risk Level"
    value={riskLevel}
/>

        </motion.div>

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
          bg-gradient-to-r
          from-cyan-500/10
          via-blue-500/10
          to-purple-500/10
          p-6
        "
      >
        <p className="leading-8 text-zinc-300">
          
  <strong>Repository Quality:</strong> {quality}
  <br />
  <strong>Production Ready:</strong>{" "}
  {deploymentReady ? "Yes" : "No"}
  <br />
  <strong>Engineering Score:</strong> {score}%
  <br />
  <strong>Production Score:</strong> {productionScore}%
  <br />
  <strong>Risk Level:</strong> {riskLevel}
</p>
        
      </motion.div>
      <motion.div
  initial={{
    scaleX: 0,
  }}
  whileInView={{
    scaleX: 1,
  }}
  viewport={{
    once: true,
  }}
  transition={{
    duration: 1,
    delay: 0.4,
  }}
  className="
    mt-8
    h-px
    origin-left
    bg-gradient-to-r
    from-cyan-400
    via-blue-500
    to-transparent
  "
/>
      </div>
    </motion.section>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
}

function MetricCard({
  icon,
  title,
  value,
}: MetricCardProps) {
  return (
    <motion.div
  variants={itemVariants}
  whileHover={{
    y: -6,
    scale: 1.02,
  }}
  transition={{
    type: "spring",
    stiffness: 260,
  }}
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-5
      "
    >
      <div className="flex items-center gap-3">

        <div className="text-cyan-400">
          {icon}
        </div>

        <div>

          <p className="text-sm text-zinc-500">
            {title}
          </p>

          {typeof value === "number" ? (
  <AnimatedCounter
    value={value}
    className="mt-1 text-xl font-semibold text-white"
  />
) : (
  <p className="mt-1 text-xl font-semibold text-white">
    {value}
  </p>
)}

        </div>

      </div>
    </motion.div>
  );
}