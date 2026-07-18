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
  index?: number;
}

export function RepositoryAssessment({
  repository,
  analytics,
}: RepositoryAssessmentProps) {
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
        relative
        overflow-hidden
        rounded-[36px]
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
    -right-24
    -top-24
    h-72
    w-72
    rounded-full
    bg-cyan-500/10
    blur-[120px]
    pointer-events-none
  "
  animate={{
    scale: [1, 1.15, 1],
    opacity: [0.15, 0.4, 0.15],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
  }}
/>
<div className="relative z-10">
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
  className="flex items-center gap-3"
>

        <motion.div
  animate={{
    rotate: [0, 6, -6, 0],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
  }}
>
  <Brain className="text-cyan-400" />
</motion.div>

        <div>

          <h3 className="text-2xl font-bold text-white">
            AI Repository Assessment
          </h3>

          <p className="text-zinc-400">
            Automated engineering evaluation
          </p>

        </div>

      </motion.div>

      <div className="mt-10 space-y-7">

        {metrics.map((metric, index) => (
  <motion.div
    key={metric.label}
    initial={{
      opacity: 0,
      y: 18,
    }}
    whileInView={{
      opacity: 1,
      y: 0,
    }}
    viewport={{
      once: true,
    }}
    transition={{
      delay: index * 0.08,
    }}
  >
    <MetricRow
    {...metric}
    index={index}
/>
  </motion.div>
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
        whileHover={{
    scale:1.02,
    y:-6,
    boxShadow:
      "0 0 45px rgba(34,211,238,.18)",
}}
      >
        <div className="flex items-center justify-between">

  <p className="text-lg font-semibold text-white">
    Overall Verdict
  </p>
  <p
className="
mt-1
text-xs
uppercase
tracking-[0.3em]
text-zinc-500
"
>
AI Evaluation
</p>

  <motion.span
  animate={{
      scale:[1,1.05,1],
  }}
  transition={{
      duration:2.5,
      repeat:Infinity,
  }}
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
  </motion.span>

</div>
<p className="mt-4 text-zinc-300 leading-8">
  {verdict}
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
  }}
  className="
    mt-10
    h-px
    origin-left
    bg-gradient-to-r
    from-cyan-400
    via-blue-500/40
    to-transparent
  "
/>
</div>
    </motion.section>
  );
}


function MetricRow({
  label,
  value,
  icon,
  index = 0,
}: Metric) {
  return (
    <motion.div
      whileHover={{
        x: 6,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 240,
      }}
    >
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
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
        />
      </div>
    </motion.div>
  );
}