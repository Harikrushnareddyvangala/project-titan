"use client";

import { motion } from "framer-motion";
import type { GithubRepository } from "@/types/github";
import { AnimatedCounter } from "./AnimatedCounter";

interface RepositoryHealthRingProps {
  repository: GithubRepository;
}

export function RepositoryHealthRing({
  repository,
}: RepositoryHealthRingProps) {
  const radius = 72;

  const circumference = 2 * Math.PI * radius;
  const score =
  Math.min(
    100,
    Math.round(
      repository.stargazers_count * 2 +
      repository.forks_count * 3 +
      repository.watchers_count
    )
  );

  const progress =
    circumference -
    (score / 100) * circumference;
  const status =
  score >= 90
    ? "Excellent"
    : score >= 75
      ? "Healthy"
      : score >= 60
        ? "Fair"
        : "Needs Work";

const statusColor =
  score >= 90
    ? "text-green-400"

    : score >= 75
      ? "text-cyan-400"

      : score >= 60
        ? "text-yellow-400"

        : "text-red-400";

const updated = new Date(repository.updated_at);

const daysSinceUpdate = Math.floor(
  (Date.now() - updated.getTime()) /
    (1000 * 60 * 60 * 24),
);

  return (
    <motion.div
      whileHover={{
        scale: 1.04,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
      }}
      className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-3xl
        p-8
        min-h-[560px]
      "
    >
      {/* Glow */}

      <motion.div
        className="
          absolute
          -right-20
          -top-20
          h-72
          w-72
          rounded-full
          bg-cyan-500/15
          blur-[140px]
        "
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15,0.5,0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10 flex flex-col items-center">

        <h3
          className="
            text-lg
            font-semibold
            text-white
          "
        >
          Repository Health
        </h3>

        <div className="relative mt-8">

          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            className="-rotate-90"
          >
            {/* Track */}

            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="rgba(255,255,255,.08)"
              strokeWidth="12"
              fill="none"
            />

            {/* Progress */}

            <motion.circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{
                strokeDashoffset: circumference,
              }}
              animate={{
                strokeDashoffset: progress,
              }}
              transition={{
                duration: 1.6,
                ease: "easeOut",
              }}
            />

            <defs>
              <linearGradient
                id="gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="#22d3ee"
                />

                <stop
                  offset="100%"
                  stopColor="#3b82f6"
                />
              </linearGradient>
            </defs>

          </svg>

          {/* Center */}

          <div
            className="
              absolute
              inset-0
              flex
              flex-col
              items-center
              justify-center
            "
          >
            <motion.div
  animate={{
    scale: [1, 1.08, 1],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
  }}
  className="
  flex
  flex-col
  items-center
  "
>

  <p
    className="
    text-5xl
    font-bold
    text-white
    "
  >
    <AnimatedCounter
      value={score}
    />
  </p>

  <p
    className={`
    mt-2
    text-sm
    font-semibold
    ${statusColor}
    `}
  >
    {status}
  </p>

</motion.div>

          </div>

        </div>

        <div
className="
mt-8
space-y-5
w-full
"
>

<Metric
title="Repository Status"
value={status}
/>

<Metric
title="Last Sync"
value={`${daysSinceUpdate} days ago`}
/>

<Metric
title="Open Issues"
value={repository.open_issues_count.toString()}
/>

<Metric
title="Community"
value={
repository.watchers_count > 5
? "Strong"
: "Growing"
}
/>

</div>

      </div>

    </motion.div>
  );
}
interface MetricProps {
  title: string;
  value: string;
}

function Metric({
  title,
  value,
}: MetricProps) {
  return (
    <div
      className="
      flex
      items-center
      justify-between
      rounded-xl
      border
      border-white/10
      bg-white/[0.03]
      px-4
      py-3
      "
    >
      <span
        className="
        text-sm
        text-zinc-400
        "
      >
        {title}
      </span>

      <span
        className="
        font-semibold
        text-white
        "
      >
        {value}
      </span>

    </div>
  );
}