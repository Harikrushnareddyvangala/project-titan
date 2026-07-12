"use client";

import { motion } from "framer-motion";

import {
  Brain,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Activity,
} from "lucide-react";

import type { GithubRepository, RepositoryAnalytics } from "@/types/github";

interface RepositoryInsightsProps {
  repository: GithubRepository | null;
  analytics: RepositoryAnalytics | null;
}

export function RepositoryInsights({
  repository,
  analytics,
}: RepositoryInsightsProps) {
  if (!repository) return null;

//   const score =
//     repository.stargazers_count * 2 +
//     repository.forks_count * 3 +
//     repository.watchers_count;

//   const qualityScore =
//     Math.min(
//         100,
//         repository.stargazers_count * 2 +
//         repository.forks_count * 3 +
//         repository.watchers_count -
//         repository.open_issues_count,
//     );

// const quality =
//     qualityScore >= 90
//         ? "Outstanding"
//         : qualityScore >= 75
//         ? "Excellent"
//         : qualityScore >= 60
//         ? "Good"
//         : "Growing";

const quality =
  analytics?.quality ?? "Growing";

const engineeringScore =
  analytics?.engineeringScore ?? 0;

const productionScore =
  analytics?.productionScore ?? 0;

const healthScore =
  analytics?.healthScore ?? 0;

const deploymentReady =
  analytics?.deploymentReady ?? false;

const riskLevel =
  analytics?.riskLevel ?? "Medium";
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
        border-white/[0.08]
        bg-white/[0.05]
        backdrop-blur-3xl
        p-6
        lg:p-8
      "
    >
      <div className="flex items-center gap-4">

        <Brain
          size={28}
          className="text-cyan-400"
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            AI Repository Insights
          </h3>

          <p className="mt-1 text-zinc-400">
            Automatically generated repository assessment.
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2
xl:grid-cols-5">

        <InsightCard
          icon={<TrendingUp size={22} />}
          title="Popularity"
          value={`${repository.stargazers_count} Stars`}
          description="Repository community adoption."
        />

        <InsightCard
          icon={<ShieldCheck size={22} />}
          title="Repository Quality"
          value={quality}
          description="Estimated engineering maturity."
        />

        <InsightCard
          icon={<Activity size={22} />}
          title="Community Activity"
          value={`${repository.watchers_count} Watchers`}
          description="Current repository engagement."
        />

        <InsightCard
    icon={<ShieldCheck size={22} />}
    title="Engineering Score"
    value={`${engineeringScore}%`}
    description="Overall engineering quality."
/>

<InsightCard
    icon={<TrendingUp size={22} />}
    title="Production Score"
    value={`${productionScore}%`}
    description="Estimated production readiness."
/>

      </div>

      <motion.div
        className="
          mt-10
          rounded-2xl
          border
          border-cyan-500/20
          bg-cyan-500/10
          p-6
        "
        animate={{
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      >
        <div className="flex items-center gap-3">

          <Sparkles
            className="text-cyan-400"
          />

          <p className="leading-8 text-zinc-300">

            <span className="font-semibold text-white">
    Repository Quality:
  </span>{" "}
  {quality}

  <br /><br />

  Engineering Score:
  <span className="ml-2 font-semibold text-cyan-300">
    {engineeringScore}%
  </span>

  <br />

  Production Score:
  <span className="ml-2 font-semibold text-cyan-300">
    {productionScore}%
  </span>

  <br />

  Repository Health:
  <span className="ml-2 font-semibold text-cyan-300">
    {healthScore}%
  </span>

  <br />

  Deployment Ready:
  <span className="ml-2 font-semibold text-cyan-300">
    {deploymentReady ? "Yes" : "No"}
  </span>

  <br />

  Risk Level:
  <span className="ml-2 font-semibold text-cyan-300">
    {riskLevel}
  </span>


          </p>

        </div>

      </motion.div>

    </motion.section>
  );
}

function InsightCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{
    y:-8,
    scale:1.03,
}}

transition={{
    type:"spring",
    stiffness:250,
}}
      className="
        rounded-3xl
        border
        border-white/[0.08]
        bg-white/[0.03]
        p-6
      "
    >
      <div className="text-cyan-400">
        {icon}
      </div>

      <h4 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h4>

      <p className="mt-3 text-2xl font-bold text-cyan-300">
        {value}
      </p>

      <p className="mt-3 text-sm leading-7 text-zinc-400">
        {description}
      </p>

    </motion.div>
  );
}