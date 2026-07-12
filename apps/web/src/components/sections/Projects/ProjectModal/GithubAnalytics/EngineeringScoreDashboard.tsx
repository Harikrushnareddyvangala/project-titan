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

interface EngineeringScoreDashboardProps {
  repository: GithubRepository | null;
  analytics: RepositoryAnalytics | null;
}

// function calculateEngineeringScore(
//   repository: GithubRepository,
// ) {
//   if (!repository) return 0;

//   let score = 55;

//   // Community
//   score += Math.min(repository.stargazers_count * 2, 15);
//   score += Math.min(repository.forks_count * 2, 10);
//   score += Math.min(repository.watchers_count, 8);

//   // Maintenance
//   const updatedDays =
//     (Date.now() -
//       new Date(repository.updated_at).getTime()) /
//     (1000 * 60 * 60 * 24);

//   if (updatedDays < 30) score += 10;
//   else if (updatedDays < 90) score += 5;

//   // Penalize excessive issues
//   score -= Math.min(repository.open_issues_count, 10);

//   return Math.max(0, Math.min(100, Math.round(score)));
// }

// function grade(score: number) {
//   if (score >= 95) return "A+";
//   if (score >= 90) return "A";
//   if (score >= 80) return "B";
//   if (score >= 70) return "C";
//   return "D";
// }

// function statusColor(score: number) {
//   if (score >= 90) return "text-emerald-400";
//   if (score >= 80) return "text-cyan-400";
//   if (score >= 70) return "text-yellow-400";
//   return "text-red-400";
// }

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
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Engineering Score
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Production Readiness
          </h2>

        </div>

        <ShieldCheck
          size={38}
          className="text-cyan-400"
        />

      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">

        {/* LEFT */}

        <motion.div
          whileHover={{
            scale: 1.02,
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
          <div
            className={`
              text-7xl
              font-black
              ${scoreColor}
            `}
          >
            {score}
          </div>

          <div className="mt-3 text-zinc-400">
            Overall Engineering Score
          </div>

          <div
            className="
              mt-6
              inline-flex
              rounded-full
              bg-white/10
              px-5
              py-2
              text-lg
              font-bold
              text-white
            "
          >
            Grade {grade}
          </div>
        </motion.div>

        {/* RIGHT */}

        <div className="grid gap-5 sm:grid-cols-2">

          <MetricCard
            icon={<Star size={20} />}
            title="Stars"
            value={repository.stargazers_count.toLocaleString()}
          />

          <MetricCard
            icon={<GitBranch size={20} />}
            title="Forks"
            value={repository.forks_count.toLocaleString()}
          />

          <MetricCard
            icon={<Eye size={20} />}
            title="Watchers"
            value={repository.watchers_count.toLocaleString()}
          />

          <MetricCard
            icon={<Bug size={20} />}
            title="Open Issues"
            value={repository.open_issues_count.toString()}
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
          bg-gradient-to-r
          from-cyan-500/10
          via-blue-500/10
          to-purple-500/10
          p-6
        "
      >
        <p className="leading-8 text-zinc-300">
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
        </p>
      </motion.div>
    </motion.section>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function MetricCard({
  icon,
  title,
  value,
}: MetricCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
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

          <p className="mt-1 text-xl font-semibold text-white">
            {value}
          </p>

        </div>

      </div>
    </motion.div>
  );
}