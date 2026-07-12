"use client";

import { motion } from "framer-motion";

import {
  Brain,
  ShieldCheck,
  BookOpen,
  Users,
  Rocket,
} from "lucide-react";

import type { GithubRepository, RepositoryAnalytics } from "@/types/github";

interface RepositoryAssessmentProps {
  repository: GithubRepository;
  analytics: RepositoryAnalytics | null;
}

interface Metric {
  label: string;
  value: number;
  icon: React.ReactNode;
}

export function RepositoryAssessment({
  repository,
  analytics,
}: RepositoryAssessmentProps) {

  // const engineering =
  //   Math.min(
  //     100,
  //     70 +
  //       repository.stargazers_count +
  //       repository.forks_count,
  //   );

    

  // const maintainability =
  //   Math.max(
  //     60,
  //     100 -
  //       repository.open_issues_count * 2,
  //   );

  // const documentation =
  //   repository.description
  //     ? 92
  //     : 60;

  // const community =
  //   Math.min(
  //     100,
  //     repository.watchers_count * 8 +
  //       repository.forks_count * 5,
  //   );

  // const production =
  //   Math.min(
  //     100,
  //     engineering * 0.4 +
  //       maintainability * 0.3 +
  //       documentation * 0.3,
  //   );

  //   const verdict =
  // production > 90
  //   ? "Outstanding production-ready repository."
  //   : production > 80
  //   ? "Well engineered with excellent maintainability."
  //   : production > 70
  //   ? "Solid implementation with room for optimization."
  //   : "Growing repository with improvement opportunities.";

  //   const grade =
  // production >= 95
  //   ? "A+"
  //   : production >= 90
  //   ? "A"
  //   : production >= 80
  //   ? "B+"
  //   : production >= 70
  //   ? "B"
  //   : "C";
  const engineering =
  analytics?.engineeringScore ?? 0;

const maintainability =
  analytics?.healthScore ?? 0;

const documentation =
  repository.description ? 92 : 60;

const community =
  Math.min(
    100,
    repository.watchers_count * 8 +
      repository.forks_count * 5,
  );

const production =
  analytics?.productionScore ?? 0;

const quality =
  analytics?.quality ?? "Growing";

const deploymentReady =
  analytics?.deploymentReady ?? false;

const riskLevel =
  analytics?.riskLevel ?? "Medium";

  const verdict =
  deploymentReady
    ? `${quality} repository ready for production deployment.`
    : `${quality} repository with ${riskLevel.toLowerCase()} deployment confidence.`;

  const grade =
  production >= 95
    ? "A+"
    : production >= 90
    ? "A"
    : production >= 80
    ? "B+"
    : production >= 70
    ? "B"
    : "C";

  // const metrics: Metric[] = [
  //   {
  //     label: "Engineering Quality",
  //     value: engineering,
  //     icon: <ShieldCheck size={18} />,
  //   },
  //   {
  //     label: "Maintainability",
  //     value: maintainability,
  //     icon: <Rocket size={18} />,
  //   },
  //   {
  //     label: "Documentation",
  //     value: documentation,
  //     icon: <BookOpen size={18} />,
  //   },
  //   {
  //     label: "Community",
  //     value: community,
  //     icon: <Users size={18} />,
  //   },
  //   {
  //     label: "Production Ready",
  //     value: production,
  //     icon: <Brain size={18} />,
  //   },
  // ];
const metrics: Metric[] = [
  {
    label: "Engineering Quality",
    value: engineering,
    icon: <ShieldCheck size={18} />,
  },
  {
    label: "Repository Health",
    value: maintainability,
    icon: <Rocket size={18} />,
  },
  {
    label: "Documentation",
    value: documentation,
    icon: <BookOpen size={18} />,
  },
  {
    label: "Community",
    value: community,
    icon: <Users size={18} />,
  },
  {
    label: "Production Readiness",
    value: production,
    icon: <Brain size={18} />,
  },
];
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
        rounded-[36px]
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-3xl
        p-8
      "
    >
      <div className="flex items-center gap-3">

        <Brain
          className="text-cyan-400"
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            AI Repository Assessment
          </h3>

          <p className="text-zinc-400">
            Automated engineering evaluation
          </p>

        </div>

      </div>

      <div className="mt-10 space-y-7">

        {metrics.map((metric) => (
          <MetricRow
            key={metric.label}
            {...metric}
          />
        ))}

      </div>

      <motion.div
        className="
          mt-10
          rounded-3xl
          border
          border-cyan-400/20
          bg-cyan-500/10
          p-6
        "
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      >
        <div className="flex items-center justify-between">

  <p className="text-lg font-semibold text-white">
    Overall Verdict
  </p>

  <span
    className="
      rounded-full
      border
      border-cyan-400/20
      bg-cyan-500/10
      px-4
      py-1
      text-sm
      font-semibold
      text-cyan-300
    "
  >
    Grade {grade}
  </span>

</div>
<p className="mt-4 text-zinc-300 leading-8">
  {verdict}
</p>

      </motion.div>

    </motion.section>
  );
}

function MetricRow({
  label,
  value,
  icon,
}: Metric) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="text-cyan-400">
            {icon}
          </div>

          <span className="text-white">
            {label}
          </span>

        </div>

        <span className="font-semibold text-cyan-300">
          {value}%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">

        <motion.div
          initial={{
            width: 0,
          }}
          whileInView={{
            width: `${value}%`,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1.4,
          }}
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-cyan-400
            to-blue-500
          "
        />

      </div>

    </div>
  );
}