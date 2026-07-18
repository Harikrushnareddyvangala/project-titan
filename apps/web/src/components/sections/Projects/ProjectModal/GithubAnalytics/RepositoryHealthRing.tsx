"use client";

import { motion } from "framer-motion";
import type { GithubRepository } from "@/types/github";
import { AnimatedCounter } from "./AnimatedCounter";
import { RepositoryAnalytics } from "@/types/github";
// import {
//   analyzeRepository,
// } from "@/lib/github/githubAnalytics";

interface RepositoryHealthRingProps {
  repository: GithubRepository;
  analytics: RepositoryAnalytics | null;
}
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};
export function RepositoryHealthRing({
  repository,
  analytics,
}: RepositoryHealthRingProps) {
  const radius = 72;

  const circumference = 2 * Math.PI * radius;
  const score =
   analytics?.engineeringScore ??
    0;

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
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={containerVariants}
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
        border-white/[0.08]
        bg-white/[0.05]
        backdrop-blur-3xl
        p-6
        lg:p-8
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
    scale:[1,1.22,1],
    opacity:[0.15,0.45,0.15],
    rotate:[0,360],
}}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />

      <motion.div
    whileHover={{
        x: 6,
        scale: 1.02,
    }}
    transition={{
        type: "spring",
        stiffness: 260,
    }} className="relative z-10 flex flex-col items-center">

        <motion.h3
    variants={itemVariants}
          className="
            text-lg
            font-semibold
            text-white
          "
        >
          Repository Health
       </motion.h3>
<motion.p
variants={itemVariants}
className="
mt-2
text-xs
uppercase
tracking-[0.35em]
text-cyan-400
"
>
AI Certified Repository
</motion.p>
        <motion.div
    variants={itemVariants}
    className="relative mt-8"
>

          <motion.svg
            animate={{
        rotate: 360,
    }}
    transition={{
        duration: 60,
        repeat: Infinity,
        ease: "linear",
    }}
            width="180"
            height="180"
            viewBox="0 0 180 180"
            className="-rotate-90
            drop-shadow-[0_0_24px_rgba(34,211,238,.25)]
            "
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

          </motion.svg>

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
className="
absolute
h-24
w-24
rounded-full
bg-cyan-400/10
blur-2xl
"
animate={{
    scale:[1,1.4,1],
    opacity:[0.2,0.5,0.2],
}}
transition={{
    duration:3,
    repeat:Infinity,
}}
/>
            <motion.div
    variants={itemVariants}
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
  text-6xl
  font-black
  bg-gradient-to-r
  from-cyan-300
  via-white
  to-blue-400
  bg-clip-text
  text-transparent
  drop-shadow-[0_0_18px_rgba(34,211,238,.25)]
  "
>
    <AnimatedCounter
      value={score}
    />
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
Health Score
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

        </motion.div>

        <motion.div
    variants={containerVariants}
    className="
    mt-8
    space-y-5
    w-full
"
>

<motion.div variants={itemVariants}>
<Metric
title="Repository Status"
value={status}
/>
</motion.div>

<motion.div variants={itemVariants}>
<Metric
title="Last Sync"
value={`${daysSinceUpdate} days ago`}
/>
</motion.div>

<motion.div variants={itemVariants}>
<Metric
title="Open Issues"
value={repository.open_issues_count.toString()}
/>
</motion.div>

<motion.div variants={itemVariants}>
<Metric
title="Community"
value={
repository.watchers_count > 5
? "Strong"
: "Growing"
}
/>
</motion.div>

</motion.div>

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
    <motion.div
whileHover={{
    y:-3,
    scale:1.02,
}}
transition={{
    type:"spring",
    stiffness:260,
}}
className="
flex
items-center
justify-between
rounded-xl
border
border-white/[0.08]
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

    </motion.div>
  );
}